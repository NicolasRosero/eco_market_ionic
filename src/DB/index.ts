// Data de ejemplo de productos
export const productsDB = [
  {
    "id": 1,
    "name": "Cepillo de Bambú Ecológico",
    "desc": "Cepillo dental hecho con mango de bambú biodegradable y cerdas suaves libres de BPA.",
    "price": 12000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Cuidado personal",
      "image": "assets/images/cuidado_personal.png"
    },
    "stock": 50,
    "noted": true
  },
  {
    "id": 4,
    "name": "Shampoo Sólido Natural",
    "desc": "Elaborado con aceites esenciales, sin sulfatos ni plásticos. Ideal para cabello normal.",
    "price": 32000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Cuidado personal",
      "image": "assets/images/cuidado_personal.png"
    },
    "stock": 25,
    "noted": false
  },
  {
    "id": 6,
    "name": "Acondicionador Sólido",
    "desc": "Barra nutritiva para el cabello con manteca de cacao. Cero residuos.",
    "price": 35000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Cuidado personal",
      "image": "assets/images/cuidado_personal.png"
    },
    "stock": 30
  },
  {
    "id": 7,
    "name": "Crema Corporal Sólida",
    "desc": "Hidratante sólido a base de karité y coco. Ideal para pieles sensibles.",
    "price": 45000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Cuidado personal",
      "image": "assets/images/cuidado_personal.png"
    },
    "stock": 20
  },
  {
    "id": 8,
    "name": "Desodorante Natural en Barra",
    "desc": "Fórmula sin aluminio ni parabenos, a base de aceites y extractos naturales.",
    "price": 27000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Cuidado personal",
      "image": "assets/images/cuidado_personal.png"
    },
    "stock": 45,
    "noted": true
  },
  {
    "id": 2,
    "name": "Botella Reutilizable de Acero Inoxidable",
    "desc": "Botella térmica libre de plásticos, mantiene las bebidas frías o calientes por horas.",
    "price": 68000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Reutilizables",
      "image": "assets/images/reutilizable.png"
    },
    "stock": 30
  },
  {
    "id": 5,
    "name": "Kit de Cubiertos Reutilizables",
    "desc": "Set de cubiertos de bambú con estuche de tela. Perfecto para llevar y evitar plásticos de un solo uso.",
    "price": 28000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Reutilizables",
      "image": "assets/images/reutilizable.png"
    },
    "stock": 35,
    "noted": true
  },
  {
    "id": 9,
    "name": "Vasos Plegables de Silicona",
    "desc": "Vasos portátiles de silicona de grado alimenticio, perfectos para café en movimiento.",
    "price": 22000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Reutilizables",
      "image": "assets/images/reutilizable.png"
    },
    "stock": 40
  },
  {
    "id": 10,
    "name": "Envolturas de Cera de Abeja (Set)",
    "desc": "Alternativa al papel film, ideal para conservar alimentos de forma natural. 3 tamaños.",
    "price": 38000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Reutilizables",
      "image": "assets/images/reutilizable.png"
    },
    "stock": 55
  },
  {
    "id": 11,
    "name": "Pajitas de Acero Inoxidable (Set)",
    "desc": "Set de 4 pajitas metálicas con cepillo de limpieza. Ecológicas y duraderas.",
    "price": 15000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Reutilizables",
      "image": "assets/images/reutilizable.png"
    },
    "stock": 60,
    "noted": false
  },
  {
    "id": 3,
    "name": "Bolsa de Tela Orgánica",
    "desc": "Bolsa de algodón orgánico ideal para compras, resistente y lavable.",
    "price": 25000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Accesorios",
      "image": "assets/images/accesorios.png"
    },
    "stock": 40,
    "noted": false
  },
  {
    "id": 12,
    "name": "Dispensador de Jabón de Bambú",
    "desc": "Elegante dispensador para jabón líquido, con cuerpo de vidrio y tapa de bambú.",
    "price": 30000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Accesorios",
      "image": "assets/images/accesorios.png"
    },
    "stock": 30
  },
  {
    "id": 13,
    "name": "Malla para Lavar Frutas y Verduras",
    "desc": "Bolsa de malla reutilizable, ideal para pesar y lavar productos frescos.",
    "price": 18000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Accesorios",
      "image": "assets/images/accesorios.png"
    },
    "stock": 50,
    "noted": true
  },
  {
    "id": 14,
    "name": "Porta-cepillos de Viaje",
    "desc": "Estuche de bambú ventilado para llevar tu cepillo de forma higiénica.",
    "price": 14000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Accesorios",
      "image": "assets/images/accesorios.png"
    },
    "stock": 65
  },
  {
    "id": 15,
    "name": "Estropajo de Luffa Natural",
    "desc": "Esponja vegetal biodegradable, perfecta para exfoliar la piel o lavar platos.",
    "price": 10000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Accesorios",
      "image": "assets/images/accesorios.png"
    },
    "stock": 70
  },
  {
    "id": 16,
    "name": "Toalla Facial de Bambú",
    "desc": "Toalla pequeña y suave, hecha de fibra de bambú hipoalergénica.",
    "price": 16000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Higiene personal",
      "image": "assets/images/higiene_personal.png"
    },
    "stock": 45
  },
  {
    "id": 17,
    "name": "Hisopos Reutilizables de Silicona",
    "desc": "Alternativa duradera y lavable a los bastoncillos de algodón tradicionales.",
    "price": 21000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Higiene personal",
      "image": "assets/images/higiene_personal.png"
    },
    "stock": 35
  },
  {
    "id": 18,
    "name": "Bálsamo Labial Cero Plástico",
    "desc": "Hidratante labial en envase de cartón biodegradable con ingredientes orgánicos.",
    "price": 18000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Higiene personal",
      "image": "assets/images/higiene_personal.png"
    },
    "stock": 55,
    "noted": true
  },
  {
    "id": 19,
    "name": "Pastillas de Pasta Dental",
    "desc": "Alternativa sólida y natural a la pasta de dientes en tubo. Sin fluoruro.",
    "price": 29000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Higiene personal",
      "image": "assets/images/higiene_personal.png"
    },
    "stock": 30
  },
  {
    "id": 20,
    "name": "Jabón de Manos Artesanal",
    "desc": "Jabón en barra hecho a mano con ingredientes locales y envuelto en papel reciclado.",
    "price": 13000,
    "image": "assets/images/producto_skeleton.png",
    "category": {
      "name": "Higiene personal",
      "image": "assets/images/higiene_personal.png"
    },
    "stock": 75
  }
]
