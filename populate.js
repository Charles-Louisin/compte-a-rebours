const mongoose = require('mongoose');
const Task = require('./models/Task');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test-checklist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // Clear existing tasks
  await Task.deleteMany({});

  // Front tasks
  const frontTasks = [
    "La page menu affiche correctement tous les produits et catégories",
    "Les produits indisponibles sont signalés visuellement",
    "Lors de l'ajout au panier, le bon produit et quantité sont pris en compte",
    "Possibilité de sélectionner des produits et de les envoyer en commande",
    "Commande créée visible sur le résumé du client",
    "Changement de statut visible pour la réception (dashboard)",
    "Test offline : la commande fonctionne si le client est sur le Wi-Fi local",
    "Scanner QR code attribue automatiquement la table à la commande",
    "Pas besoin que le client indique la table manuellement",
    "Vérifier que la réception reçoit la commande de la bonne table",
    "Affiche le montant exact à payer dans le résumé",
    "Affiche choix paiement ONLINE / USSD",
    "Statut paiement mis à jour automatiquement après paiement",
    "Facture téléchargeable après paiement",
    "La facture s'affiche correctement avec tous les produits",
    "Possibilité de télécharger ou partager la facture",
    "Tableau de bord montre toutes les commandes en cours",
    "Statuts changent en temps réel",
    "Notifications arrivent quand une commande est payée ou mise à jour",
    "Test avec Wi-Fi local et aucun internet : commande fonctionne et remonte à la réception",
    "Quand internet revient, les commandes offline se synchronisent correctement",
    "Notifications visibles sur le dashboard de la réception",
    "Notifications disparaissent quand l'utilisateur clique dessus"
  ];

  // Back tasks
  const backTasks = [
    "GET /api/restaurants/:restaurantId/menu - Retourne le menu complet avec catégories et produits",
    "POST /api/products / PATCH /api/products/:id / DELETE /api/products/:id - Création, modification, suppression produit fonctionne",
    "POST /api/categories / PATCH /api/categories/:id / DELETE /api/categories/:id - Création/modif/suppression catégorie fonctionnelle",
    "POST /api/orders - Vérifier création d'une commande avec items",
    "GET /api/tables/:tableId/orders - Récupère toutes les commandes de la table",
    "PATCH /api/orders/:orderId/status - Status passe bien entre PENDING → IN_PROGRESS → SERVED → PAID",
    "POST /api/tables - crée une table avec QR code unique",
    "GET /api/tables/:id - renvoie les infos de la table",
    "PATCH /api/tables/:id - modifie le nom de la table",
    "DELETE /api/tables/:id - supprime la table",
    "POST /api/payments/init - crée un paiement correct",
    "POST /api/payments/ussd - génère un code valide",
    "GET /api/payments/:orderId/status - retourne statut correct (PENDING, PAID, FAILED)",
    "POST /api/payments/confirm - marque bien la commande comme PAYÉE",
    "GET /api/invoices/:orderId - retourne facture complète",
    "GET /api/orders?restaurantId=R_ID&status=ACTIVE - retourne toutes commandes en cours",
    "Toutes les commandes doivent être stockées même si le client est offline",
    "Synchronisation automatique quand le client retrouve le net",
    "Vérification que les doublons ne sont pas créés",
    "Notification créée à chaque nouvelle commande",
    "Notification créée à chaque paiement validé"
  ];

  // Save front tasks
  for (const desc of frontTasks) {
    const task = new Task({ type: 'front', description: desc });
    await task.save();
  }

  // Save back tasks
  for (const desc of backTasks) {
    const task = new Task({ type: 'back', description: desc });
    await task.save();
  }

  console.log('Database populated with initial tasks');
  mongoose.connection.close();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
