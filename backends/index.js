import { chromium } from '@playwright/test';
import ExcelJS from 'exceljs';
import axios from 'axios';

// Function to scrape GitHub topics and associated repositories
async function scrapeGitHubTopics(number) {
  const browser = await chromium.launch({ headless: false });//launch the chromium browser
  const context = await browser.newContext();//create a new browser context
  const page = await context.newPage();  // Open a new page in the browser
  let topicNumber = 0; // Initialize the topic counter

  try {
    // Continue scraping until the specified number of topics is reached
    while(topicNumber < number) {
      console.log("Accès à la page 'Topics' de GitHub...");
      await page.goto('https://github.com/topics');// Navigate to the GitHub topics page
      await page.waitForLoadState('networkidle'); // Wait until the page has finished loading

      const topics = await page.locator('div.py-4.border-bottom');// Locate all the topic elements

        // Extract the topic data (name, description, and URL)
      const allTopicsData = await topics.evaluateAll((topics) =>
        topics.map((topic) => {
          const name = topic.querySelector('p.f3.lh-condensed')?.textContent.trim() || 'N/A';
          const description = topic.querySelector('p.f5.color-fg-muted')?.textContent.trim() || 'N/A';
          const url = topic.querySelector('a')?.href || 'N/A';
  
          return { name, description, url };// Return topic details as an object
        })
      );
  
      console.log('Topics extraits :', allTopicsData);
  
      const allRepositories = [];// Initialize an array to store all repository data
      const excelData = []; // Initialize an array for Excel data
  
      for (let i = 0; i < allTopicsData.length && topicNumber < number; i++) {
        const topic = allTopicsData[i];
        console.log(`Accès aux repositories du topic : ${topic.name}`);
        await page.goto(topic.url);// Navigate to the topic's URL
        await page.waitForTimeout(2000);// Wait for a brief moment
        await page.waitForSelector('article.border.rounded.color-shadow-small', { timeout: 5000 }); // Wait for repositories to load
  
        const repositories = await page.locator('article.border.rounded.color-shadow-small'); // Locate repository elements
          // Extract repository data (name, URL, stars, description, and tags)
        const repoData = await repositories.evaluateAll((repos, topic) =>
          repos.map((repo) => {
            const repoName = repo.querySelector('h3 a')?.textContent.trim() || 'N/A';
            const repoUrl = repo.querySelector('h3 a')?.href || 'N/A';
            const repoStarsText = repo.querySelector('span[aria-label*="star"]')?.textContent.trim() || '0';

              // Function to parse the star count (k for thousand, M for million)
            function parseStarsCount(stars) {
              if (stars.endsWith('k')) {
                return parseFloat(stars) * 1000;; // Convert 'k' to thousands
              } else if (stars.endsWith('M')) {
                return parseFloat(stars) * 1000000; // Convert 'M' to millions
              } else {
                return parseInt(stars, 10) || 0;// Return the star count as an integer
              }
            }
  
            const repoStars = parseStarsCount(repoStarsText);// Parse the star count
            const repoDescription = repo.querySelector('p.color-fg-muted')?.textContent.trim() || 'N/A';
            const tags = Array.from(repo.querySelectorAll('a.topic-tag')).map((tag) =>
              tag.textContent.trim()// Get tags associated with the repository
            );

            // Return repository data along with the associated topic data
            return {
              topicName: topic.name,
              topicDescription: topic.description,
              topicUrl: topic.url,
              repoName,
              repoUrl,
              repoStars,
              repoDescription,
              tags,
            };
          })
         , topic);
  
               // Push extracted repository data to the arrays
              repoData.forEach(repo => {
                const data = {
                    Topic: repo.topicName,
                    TopicDescription: repo.topicDescription,
                    RepoName: repo.repoName,
                    RepoUrl: repo.repoUrl,
                    Stars: repo.repoStars,
                    Description: repo.repoDescription,
                    Tags: repo.tags.join(', '), // Join tags into a string
                };
            
                excelData.push(data); // Add data to Excel data array
                allRepositories.push(data);// Add data to all repositories array
            });
            

  
        topicNumber++; // Increment the topic counter
        if (topicNumber >= number) {
          break;  // Exit if we've reached the desired number of topics
        }
      }
  
      console.log('Repositories extraits :', allRepositories);
  
      if (allRepositories.length > 0) {
        try {
          // Send the extracted repository data to MongoDB using axios
          await axios.post('http://localhost:3000/api/repositories', allRepositories);
          console.log('Tous les repositories ont été ajoutés avec succès à MongoDB');
        } catch (error) {
          console.error("Erreur lors de l'ajout des repositories à MongoDB :", error);
        }
      } else {
        console.log("Aucun repository trouvé, pas d'ajout à la base de données.");
      }

        // Create an Excel file to store the data
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('NewGit topic');
  
      worksheet.columns = [
        { header: 'Topic', key: 'Topic', width: 20 },
        { header: 'Repo Name', key: 'RepoName', width: 30 },
        { header: 'Repo URL', key: 'RepoUrl', width: 50 },
        { header: 'Stars', key: 'Stars', width: 10 },
        { header: 'Description', key: 'Description', width: 50 },
        { header: 'Tags', key: 'Tags', width: 30 },
      ];

        // Add rows to the worksheet based on the extracted data
      excelData.forEach((data) => {
        worksheet.addRow(data);
      });
  
      const fileName = 'GitHub_Topics.xlsx';// Set the output file name
      await workbook.xlsx.writeFile(fileName); // Write data to the Excel file
      console.log(`Données enregistrées dans ${fileName}`);// Log the success message
    }
  } catch (error) {
    console.error('Erreur pendant le scraping :', error);
  } finally {
    await browser.close();// Ensure the browser is closed after the script completes
  }
}
// Start the scraping process and scrape data for 2 topics
scrapeGitHubTopics(2); 

