
// import { chromium } from '@playwright/test';
// import ExcelJS from 'exceljs';
// import axios from 'axios';

// async function scrapeGitHubTopics() {
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   try {
//     console.log("Accès à la page 'Topics' de GitHub...");
//     await page.goto('https://github.com/topics');
//     await page.waitForLoadState('networkidle'); // Attendre que la page soit complètement chargée

//     // Sélectionner tous les topics
//     const topics = await page.locator('div.py-4.border-bottom');

//     // Extraire les informations de chaque topic
//     const allTopicsData = await topics.evaluateAll((topics) =>
//       topics.map((topic) => {
//         const name = topic.querySelector('p.f3.lh-condensed')?.textContent.trim() || 'N/A';
//         const description = topic.querySelector('p.f5.color-fg-muted')?.textContent.trim() || 'N/A';
//         const url = topic.querySelector('a')?.href || 'N/A';

//         return { name, description, url };
//       })
//     );

//     console.log('Topics extraits :', allTopicsData);

//     // Stocker tous les résultats dans un tableau
//     const excelData = [];

//     // Parcourir chaque topic et extraire les repositories associés
//     for (const topic of allTopicsData) {
//       console.log(`Accès aux repositories du topic : ${topic.name}`);
//       await page.goto(topic.url);
//       await page.waitForLoadState('networkidle');
  
//       await page.waitForSelector('article.border.rounded.color-shadow-small');
//       const repositories = await page.locator('article.border.rounded.color-shadow-small');
//    // Attendre que les repositories soient chargés
//   //  await page.waitForSelector('article.border.rounded.color-shadow-small');
//   //  const repositor = await page.locator('article.border.rounded.color-shadow-small');

//       const repoData = await repositories.evaluateAll((repos) =>
//         repos.map((repo) => {
//           const repoName = repo.querySelector('h3 a')?.textContent.trim() || 'N/A';
//           const repoUrl = repo.querySelector('h3 a')?.href || 'N/A';

//           const repoStarsText = repo.querySelector('span#repo-stars-counter-star')?.textContent.trim() || '0';

//           function parseStarsCount(stars) {
//             if (stars.endsWith('k')) {
//               return parseFloat(stars) * 1000;
//             } else if (stars.endsWith('M')) {
//               return parseFloat(stars) * 1000000;
//             } else {
//               return parseInt(stars, 10) || 0;
//             }
//           }
//           // Conversion des étoiles si nécessaire
//           const repoStars = parseStarsCount(repoStarsText);
//           const repoDescription = repo.querySelector('p.color-fg-muted')?.textContent.trim() || 'N/A';
//           const tags = Array.from(repo.querySelectorAll('a.topic-tag')).map((tag) =>
//             tag.textContent.trim()
//           );

//           return { repoName, repoUrl, repoStars, repoDescription, tags };
//         })
//       );

//       console.log(`Repositories pour le topic "${topic.name}" :`, repoData);

//       //store data 
//       for(const repo of repoData){
//         try{
//           await axios.post('http://localhost:3000/api/repositories', {
//             // // Topic: topic.name,
//             // // TopirDescription:topic.description,
//             // // TopicUrl:topic.url,
//             // reposName:repo.repoName,
//             // reposUrl:repo.repoUrl,
//             // reposStar:repo.repoStars,
//             // reposDescription:repo.repoDescription,
//             // tags:repo.tags,
//             reposName: repo.repoName,
//             reposUrl: repo.repoUrl,
//             reposStar: repo.repoStars, // Corrigé ici
//             reposDescription: repo.repoDescription,
//             tags: repo.tags
//           })
//           console.log('repository successfully  add to mongodb')
//         }catch(error){
//           console.error('erreur lors de l ajout de la repository', error)
//         }
//       }
//       //Ajouter les données au tableau pour Excel
//       repoData.forEach((repo) => {
//         excelData.push({
//           Topic: topic.name,
//           RepoName: repo.repoName,
//           RepoUrl: repo.repoUrl,
//           Stars: repo.repoStars,
//           Description: repo.repoDescription,
//           Tags: repo.tags.join(', ')
//         });
//       });
//     }

//     // axios.post('http://localhost:4000/api/repositories', {
//     //   reposName: repo.repoName,
//     //   reposUrl: repo.repoUrl,
//     //   reposStar: repo.repoStars,
//     //   reposDescription: repo.repoDescription,
//     //   tags: repo.tags,
//     // })

//     //   .then(response => {
//     //     console.log('Repository successfully added to MongoDB');
//     //   })
//     //   .catch(error => {
//     //     console.error('Error adding repository:', error);
//     //   });

//       // Créer et configurer un classeur Excel avec ExcelJS
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('GitHub Topics');

//     // Ajouter les en-têtes des colonnes
//     worksheet.columns = [
//       { header: 'Topic', key: 'Topic', width: 20 },
//       { header: 'Repo Name', key: 'RepoName', width: 30 },
//       { header: 'Repo URL', key: 'RepoUrl', width: 50 },
//       { header: 'Stars', key: 'Stars', width: 10 },
//       { header: 'Description', key: 'Description', width: 50 },
//       { header: 'Tags', key: 'Tags', width: 30 }
//     ];

//     // Ajouter les données
//     excelData.forEach((data) => {
//       worksheet.addRow(data);
//     });

//     // Enregistrer le fichier Excel
//     const fileName = 'GitHub_Topics.xlsx';
//     await workbook.xlsx.writeFile(fileName);
//     console.log(`Données enregistrées dans ${fileName}`);
//   } catch (error) {
//     console.error('Erreur pendant le scraping :', error);
//   } finally {
//     await browser.close();
//   }
// }

// scrapeGitHubTopics();

// import { chromium } from '@playwright/test';
// import ExcelJS from 'exceljs';
// import axios from 'axios';

// async function scrapeGitHubTopics() {
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   const topicName = topic.name;
//   const topicDescription = topic.description;
//   const topicurl = topic.url;
//   try {
//     console.log("Accès à la page 'Topics' de GitHub...");
//     await page.goto('https://github.com/topics');
//     await page.waitForLoadState('networkidle'); // Attendre que la page soit complètement chargée

//     const topics = await page.locator('div.py-4.border-bottom');

//     // Extraire les informations de chaque topic
//     const allTopicsData = await topics.evaluateAll((topics) =>
//       topics.map((topic) => {
//         const name = topic.querySelector('p.f3.lh-condensed')?.textContent.trim() || 'N/A';
//         const description = topic.querySelector('p.f5.color-fg-muted')?.textContent.trim() || 'N/A';
//         const url = topic.querySelector('a')?.href || 'N/A';

//         return { name, description, url };
//       })
//     );

//     console.log('Topics extraits :', allTopicsData);

//     // Conteneur pour stocker toutes les données avant insertion
//     const allRepositories = [];
//     const excelData = [];

//     for (const topic of allTopicsData) {
//       console.log(`Accès aux repositories du topic : ${topic.name}`);
//       await page.goto(topic.url);
//       await page.waitForLoadState('networkidle');
//       await page.waitForSelector('article.border.rounded.color-shadow-small');

//       const repositories = await page.locator('article.border.rounded.color-shadow-small');

//       const repoData = await repositories.evaluateAll((repos, topicName, topicDescription, opicUrl) =>
//         repos.map((repo) => {
//           const repoName = repo.querySelector('h3 a')?.textContent.trim() || 'N/A';
//           const repoUrl = repo.querySelector('h3 a')?.href || 'N/A';
//           const repoStarsText = repo.querySelector('span#repo-stars-counter-star')?.textContent.trim() || '0';

//           function parseStarsCount(stars) {
//             if (stars.endsWith('k')) {
//               return parseFloat(stars) * 1000;
//             } else if (stars.endsWith('M')) {
//               return parseFloat(stars) * 1000000;
//             } else {
//               return parseInt(stars, 10) || 0;
//             }
//           }

//           const repoStars = parseStarsCount(repoStarsText);
//           const repoDescription = repo.querySelector('p.color-fg-muted')?.textContent.trim() || 'N/A';
//           const tags = Array.from(repo.querySelectorAll('a.topic-tag')).map((tag) =>
//             tag.textContent.trim()
//           );

//           return {
//             topicName: topic.name,
//             topicDescription: topic.description,
//             topicUrl: topic.url,
//             repoName,
//             repoUrl,
//             repoStars,
//             repoDescription,
//             tags,
//           };
//         })
//       );

//       console.log(`Repositories pour le topic "${topic.name}" :`, repoData);

//       // Stocker les données dans le conteneur
//       allRepositories.push(...repoData);

//       // Ajouter les données à Excel
//       repoData.forEach((repo) => {
//         excelData.push({
//           Topic: repo.topicName,
//           RepoName: repo.repoName,
//           RepoUrl: repo.repoUrl,
//           Stars: repo.repoStars,
//           Description: repo.repoDescription,
//           Tags: repo.tags.join(', '),
//         });
//       });
//     }

//     // Envoi des données en une seule requête POST
//     if (allRepositories.length > 0) {
//       try {
//         await axios.post('http://localhost:3000/api/repositories', allRepositories);
//         console.log('Tous les repositories ont été ajoutés avec succès à MongoDB');
//       } catch (error) {
//         console.error("Erreur lors de l'ajout des repositories à MongoDB :", error);
//       }
//     } else {
//       console.log("Aucun repository trouvé, pas d'ajout à la base de données.");
//     }

//     // Génération du fichier Excel
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('GitHub Topics');

//     worksheet.columns = [
//       { header: 'Topic', key: 'Topic', width: 20 },
//       { header: 'Repo Name', key: 'RepoName', width: 30 },
//       { header: 'Repo URL', key: 'RepoUrl', width: 50 },
//       { header: 'Stars', key: 'Stars', width: 10 },
//       { header: 'Description', key: 'Description', width: 50 },
//       { header: 'Tags', key: 'Tags', width: 30 },
//     ];

//     excelData.forEach((data) => {
//       worksheet.addRow(data);
//     });

//     const fileName = 'GitHub_Topics.xlsx';
//     await workbook.xlsx.writeFile(fileName);
//     console.log(`Données enregistrées dans ${fileName}`);

//   } catch (error) {
//     console.error('Erreur pendant le scraping :', error);
//   } finally {
//     await browser.close();
//   }
// }

// scrapeGitHubTopics();

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

    for (const topic of allTopicsData) {
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

      console.log(`Repositories pour le topic "${topic.name}" :`, repoData);

      allRepositories.push(...repoData);

      repoData.forEach((repo) => {
        excelData.push({
          Topic: repo.topicName,
          RepoName: repo.repoName,
          RepoUrl: repo.repoUrl,
          Stars: repo.repoStars,
          Description: repo.repoDescription,
          Tags: repo.tags.join(', '),
        });
      });
    }
    console.log(repoData)

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
    const worksheet = workbook.addWorksheet('GitHub Topics');

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

  } catch (error) {
    console.error('Erreur pendant le scraping :', error);
  } finally {
    await browser.close();
  }
}

scrapeGitHubTopics();
