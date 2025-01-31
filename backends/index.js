import { chromium } from '@playwright/test';
import ExcelJS from 'exceljs';
import axios from 'axios';

async function scrapeGitHubTopics(number) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  let topicNumber = 0; // Initialisation de l'incrémentation du nombre de topics traités

  try {
    // Nous avons ici un test pour vérifier que le nombre de topics demandés ne dépasse pas la limite de ce qui est disponible
    while(topicNumber < number) {
      console.log("Accès à la page 'Topics' de GitHub...");
      await page.goto('https://github.com/topics');
      await page.waitForLoadState('networkidle');
  
      const topics = await page.locator('div.py-4.border-bottom');
  
      // Extraire les informations de chaque topic
      const allTopicsData = await topics.evaluateAll((topics) =>
        topics.map((topic) => {
          const name = topic.querySelector('p.f3.lh-condensed')?.textContent.trim() || 'N/A';
          const description = topic.querySelector('p.f5.color-fg-muted')?.textContent.trim() || 'N/A';
          const url = topic.querySelector('a')?.href || 'N/A';
  
          return { name, description, url };
        })
      );
  
      console.log('Topics extraits :', allTopicsData);
  
      const allRepositories = [];
      const excelData = [];
  
      // Ne traiter que jusqu'à `number` topics
      for (let i = 0; i < allTopicsData.length && topicNumber < number; i++) {
        const topic = allTopicsData[i];
        console.log(`Accès aux repositories du topic : ${topic.name}`);
        await page.goto(topic.url);
        await page.waitForTimeout(2000);
        await page.waitForSelector('article.border.rounded.color-shadow-small', { timeout: 5000 });
  
        const repositories = await page.locator('article.border.rounded.color-shadow-small');
  
        const repoData = await repositories.evaluateAll((repos, topic) =>
          repos.map((repo) => {
            const repoName = repo.querySelector('h3 a')?.textContent.trim() || 'N/A';
            const repoUrl = repo.querySelector('h3 a')?.href || 'N/A';
            const repoStarsText = repo.querySelector('span[aria-label*="star"]')?.textContent.trim() || '0';
  
            function parseStarsCount(stars) {
              if (stars.endsWith('k')) {
                return parseFloat(stars) * 1000;
              } else if (stars.endsWith('M')) {
                return parseFloat(stars) * 1000000;
              } else {
                return parseInt(stars, 10) || 0;
              }
            }
  
            const repoStars = parseStarsCount(repoStarsText);
            const repoDescription = repo.querySelector('p.color-fg-muted')?.textContent.trim() || 'N/A';
            const tags = Array.from(repo.querySelectorAll('a.topic-tag')).map((tag) =>
              tag.textContent.trim()
            );
  
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
  
        // console.log(`Repositories pour le topic "${topic.name}" :`, repoData);
      //  console.log(  topic.name,
      //         topic.description,
      //           topic.url,
      //             repoName,
      //             repoUrl,
      //             repoStars,
      //             repoDescription,
      //             tags,)


                  // topic.repositories.forEach(({ name: repoName, url: repoUrl, stars: repoStars, description: repoDescription, tags }) => {
                  //   const repoData = {
                  //     topicName: topic.name,           // Nom du topic
                  //     topicDescription: topic.description, // Description du topic
                  //     topicUrl: topic.url,             // URL du topic
                  //     repoName,                         // Nom du repo
                  //     repoUrl,                          // URL du repo
                  //     repoStars,                        // Nombre d'étoiles
                  //     repoDescription,                   // Description du repo
                  //     tags: Array.isArray(tags) ? tags.join(', ') : '' // Assurer que tags est une chaîne
                  //   };
                  
                  //   // Ajouter à allRepositories
                  //   allRepositories.push(repoData);
                  
                  //   // Ajouter au fichier Excel avec les mêmes colonnes
                  //   excelData.push({
                  //     Topic: repoData.topicName,
                  //     TopicDescription: repoData.topicDescription,
                  //     RepoName: repoData.repoName,
                  //     RepoUrl: repoData.repoUrl,
                  //     Stars: repoData.repoStars,
                  //     Description: repoData.repoDescription,
                  //     Tags: repoData.tags
                  //   });
                  // });
              repoData.forEach(repo => {
                const data = {
                    Topic: repo.topicName,
                    TopicDescription: repo.topicDescription,
                    RepoName: repo.repoName,
                    RepoUrl: repo.repoUrl,
                    Stars: repo.repoStars,
                    Description: repo.repoDescription,
                    Tags: repo.tags.join(', '),
                };
            
                excelData.push(data);
                allRepositories.push(data);
            });
            

  
        topicNumber++;  // Incrémenter le nombre de topics traités
        if (topicNumber >= number) {
          break; // Quitter la boucle dès que le nombre spécifié est atteint
        }
      }
  
      console.log('Repositories extraits :', allRepositories);
  
      if (allRepositories.length > 0) {
        try {
          await axios.post('http://localhost:3000/api/repositories', allRepositories);
          console.log('Tous les repositories ont été ajoutés avec succès à MongoDB');
        } catch (error) {
          console.error("Erreur lors de l'ajout des repositories à MongoDB :", error);
        }
      } else {
        console.log("Aucun repository trouvé, pas d'ajout à la base de données.");
      }
  
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
  
      excelData.forEach((data) => {
        worksheet.addRow(data);
      });
  
      const fileName = 'GitHub_Topics.xlsx';
      await workbook.xlsx.writeFile(fileName);
      console.log(`Données enregistrées dans ${fileName}`);
    }
  } catch (error) {
    console.error('Erreur pendant le scraping :', error);
  } finally {
    await browser.close();
  }
}

scrapeGitHubTopics(2);  // Spécifier ici le nombre de topics à scraper

