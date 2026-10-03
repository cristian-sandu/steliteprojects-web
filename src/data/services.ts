export const services = [
  {
    "id": "electricity",
    "enabled": true,
    "fr": {
      "name": "Électricité",
      "description": "Installation, rénovation, dépannage et mise en conformité des installations électriques.",
      "items": [
        "Électricité générale et dépannage électrique",
        "Recherche de panne et mise en conformité",
        "Installation et rénovation de tableaux électriques",
        "Prises, éclairages et équipements électriques"
      ]
    },
    "en": {
      "name": "Electrical services",
      "description": "Electrical installation, renovation, repairs and compliance work.",
      "items": [
        "General electrical work and repairs",
        "Fault finding and compliance work",
        "Electrical panel installation and renovation",
        "Sockets, lighting and electrical equipment"
      ]
    }
  },
  {
    "id": "plumbing",
    "enabled": true,
    "fr": {
      "name": "Plomberie",
      "description": "Installation, remplacement et dépannage des installations sanitaires et réseaux d’eau.",
      "items": [
        "Plomberie générale et dépannage plomberie",
        "Installation et remplacement d’équipements sanitaires",
        "Réseaux d’alimentation et d’évacuation d’eau"
      ]
    },
    "en": {
      "name": "Plumbing",
      "description": "Installation, replacement and repairs for sanitary fittings and water systems.",
      "items": [
        "General plumbing and plumbing repairs",
        "Sanitary fitting installation and replacement",
        "Water supply and drainage"
      ]
    }
  },
  {
    "id": "repairs",
    "enabled": true,
    "fr": {
      "name": "Dépannage",
      "description": "Recherche de panne et réparation de vos installations électriques et de plomberie.",
      "items": [
        "Recherche de panne électrique",
        "Dépannage plomberie",
        "Réparation des installations existantes"
      ]
    },
    "en": {
      "name": "Repairs",
      "description": "Fault finding and repairs for electrical and plumbing installations.",
      "items": [
        "Electrical fault finding",
        "Plumbing repairs",
        "Repairs to existing installations"
      ]
    }
  },
  {
    "id": "water-heaters",
    "enabled": true,
    "fr": {
      "name": "Ballon d’eau chaude",
      "description": "Installation et remplacement de chauffe-eau pour vos besoins en eau chaude sanitaire.",
      "items": [
        "Installation de chauffe-eau",
        "Remplacement de ballons d’eau chaude",
        "Raccordements électriques et hydrauliques"
      ]
    },
    "en": {
      "name": "Hot water cylinders",
      "description": "Water heater installation and replacement for your domestic hot water needs.",
      "items": [
        "Water heater installation",
        "Hot water tank replacement",
        "Electrical and water connections"
      ]
    }
  },
  {
    "id": "heat-pumps",
    "enabled": true,
    "fr": {
      "name": "Pompe à chaleur",
      "description": "Installation, entretien et dépannage des systèmes de chauffage et de climatisation.",
      "items": [
        "Pompes à chaleur air/eau",
        "Pompes à chaleur air/air",
        "Climatisation réversible",
        "Entretien et dépannage"
      ]
    },
    "en": {
      "name": "Heat pumps",
      "description": "Installation, maintenance and repairs for heating and air-conditioning systems.",
      "items": [
        "Air-to-water heat pumps",
        "Air-to-air heat pumps",
        "Reversible air conditioning (heating and cooling)",
        "Maintenance and repairs"
      ]
    }
  },
  {
    "id": "solar",
    "enabled": true,
    "fr": {
      "name": "Photovoltaïque",
      "description": "Installation, raccordement et entretien d’installations photovoltaïques.",
      "items": [
        "Panneaux et systèmes de fixation",
        "Onduleurs et micro-onduleurs",
        "Câblage, coffrets et protections électriques",
        "Entretien et dépannage"
      ]
    },
    "en": {
      "name": "Photovoltaic systems",
      "description": "Installation, connection and maintenance of photovoltaic systems.",
      "items": [
        "Panels and mounting systems",
        "Inverters and microinverters",
        "Wiring, enclosures and electrical protection",
        "Maintenance and repairs"
      ]
    }
  },
  {
    "id": "charging",
    "enabled": true,
    "fr": {
      "name": "Bornes de recharge",
      "description": "Installation de bornes de recharge et raccordements électriques associés.",
      "items": [
        "Étude des besoins de recharge",
        "Installation et raccordement",
        "Protections électriques adaptées"
      ]
    },
    "en": {
      "name": "EV charging points",
      "description": "Charging point installation and associated electrical connections.",
      "items": [
        "Assessment of charging needs",
        "Installation and connection",
        "Suitable electrical protection"
      ]
    }
  }
];
export const activeServices = services.filter(service => service.enabled);
