# Groupomania Backend

## Installation : 
1. Cloner le repertoire.
2. Aller à la racine du répertoire
3. Executer npm install
4. Dans le repertoire config, créer un fichier config.json dont le contenu est :
```
{
  "development": {
    "username": "root",
    "password": "LoremIpsum",
    "database": "groupomania",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```
5. Personnaliser la partie "development" du fichier avec les données de votre base MYSQL (utilisateur, mot de passe, database, host...)
6. A la racine du repertoire, créer un fichier .env contenant la clé secrète tel que ci dessous (vous pouvez adapter votre clé): 
```
SECRET="cUWt#2CCQr%00B]uPDXiR|$N:p7J`F"
```
7. Lancer `node server` (ou `nodemon server`)
8. Le serveur backend est lancé...