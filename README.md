# Perera_Archivaldo_code_1_08042022

Le dossier renferme l'API développée pour le site *HOT TAKES* dont le front est diponible sur ce [repo github](https://github.com/ArchiePerera/Web-Developer-P6).

## Architecture des répertoires

Créez un dossier vide.

Dans ce dossier, clonez le repo [Back_P6_OCR](https://github.com/ArchiePerera/Back_P6_OCR), et renommez-le "back" :

```git clone git@github.com:ArchiePerera/Back_P6_OCR.git```

Toujours dans le même dossier, clonez le [repo suivant](https://github.com/ArchiePerera/Web-Developer-P6) :

```git clone git@github.com:ArchiePerera/Web-Developer-P6.git```

Dans le dossier back, installer les dépendances :

```npm install```

Dans le dossier front, suivez les instructions du fichier README.

## Démarrer le serveur back

Pour démarrer le serveur back sans intention de modifier les fichiers :

```node server```

Pour démarrer le serveur dans l'intention de modifier les fichiers et permettre au serveur de se relancer automatiquement :

```nodemon server```

Le port de communication est 3000.

## Démarrer le serveur front

Pour démarrer le serveur front :

```npm run start```

Le port de communication est 4200.

##  Problème de ports connu

Si l'un ou l'autre des serveurs n'utilise pas les ports prévus, veuillez redémarrer l'ordinateur.

## Accès à l'application

Dans le navigateur, veuiller atteindre l'adresse suivante :

```localhost:4200```

# Exigences de sécurité

Utilisation de dépendances pour la sécurité (OWASP)

- bcrypt
- dotenv
- jsonwebtoken
- mongoose-unique-validator
- Helmet
- express-rate-limiter

Utilisation de regex pour vérification des champs email
Utilisation de conditions pour éviter des injections et l'envoi de formulaire vide


