
import { chromium } from '@playwright/test';
import ExcelJS from 'exceljs';
import axios from 'axios';

async function scrapeGitHubTopics() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Accès à la page 'Topics' de GitHub...");
    await page.goto('https://github.com/topics');
    await page.waitForLoadState('networkidle'); // Attendre que la page soit complètement chargée

    // Sélectionner tous les topics
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

    // Stocker tous les résultats dans un tableau
    const excelData = [];

    // Parcourir chaque topic et extraire les repositories associés
    for (const topic of allTopicsData) {
      console.log(`Accès aux repositories du topic : ${topic.name}`);
      await page.goto(topic.url);
      await page.waitForLoadState('networkidle');

      const repositories = await page.locator('article.border.rounded.color-shadow-small');

      const repoData = await repositories.evaluateAll((repos) =>
        repos.map((repo) => {
          const repoName = repo.querySelector('h3 a')?.textContent.trim() || 'N/A';
          const repoUrl = repo.querySelector('h3 a')?.href || 'N/A';

          const repoStarsText = repo.querySelector('span#repo-stars-counter-star')?.textContent.trim() || '0';

          function parseStarsCount(stars) {
            if (stars.endsWith('k')) {
              return parseFloat(stars) * 1000;
            } else if (stars.endsWith('M')) {
              return parseFloat(stars) * 1000000;
            } else {
              return parseInt(stars, 10) || 0;
            }
          }
          // Conversion des étoiles si nécessaire
          const repoStars = parseStarsCount(repoStarsText);
          const repoDescription = repo.querySelector('p.color-fg-muted')?.textContent.trim() || 'N/A';
          const tags = Array.from(repo.querySelectorAll('a.topic-tag')).map((tag) =>
            tag.textContent.trim()
          );

          return { repoName, repoUrl, repoStars, repoDescription, tags };
        })
      );

      console.log(`Repositories pour le topic "${topic.name}" :`, repoData);

      //store data 
      for(const repo of repoData){
        try{
          await axios.post('http://localhost:4000/api/repositories', {
            user:name,
            reposName:repo.repoName,
            reposUrl:repo.repoUrl,
            reposStar:repo.repoStars,
            reposDescription:repo.repoDescription,
            tags:repo.tags,
          })
          console.log('repository successfully  add to mongodb')
        }catch(error){
          console.error('erreur lors de l ajout de la repository', error)
        }
      }
      // Ajouter les données au tableau pour Excel
      repoData.forEach((repo) => {
        excelData.push({
          Topic: topic.name,
          RepoName: repo.repoName,
          RepoUrl: repo.repoUrl,
          Stars: repo.repoStars,
          Description: repo.repoDescription,
          Tags: repo.tags.join(', ')
        });
      });
    }

    // Créer et configurer un classeur Excel avec ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('GitHub Topics');

    // Ajouter les en-têtes des colonnes
    worksheet.columns = [
      { header: 'Topic', key: 'Topic', width: 20 },
      { header: 'Repo Name', key: 'RepoName', width: 30 },
      { header: 'Repo URL', key: 'RepoUrl', width: 50 },
      { header: 'Stars', key: 'Stars', width: 10 },
      { header: 'Description', key: 'Description', width: 50 },
      { header: 'Tags', key: 'Tags', width: 30 }
    ];

    // Ajouter les données
    excelData.forEach((data) => {
      worksheet.addRow(data);
    });

    // Enregistrer le fichier Excel
    const fileName = 'GitHub_Topics.xlsx';
    await workbook.xlsx.writeFile(fileName);
    console.log(`Données enregistrées dans ${fileName}`);
  } catch (error) {
    console.error('Erreur pendant le scraping :', error);
  } finally {
    await browser.close();
  }
}

scrapeGitHubTopics();