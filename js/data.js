const catalogo = [
  {
    id: 5,
    nombre: "Tractor John Deere 6J",
    categoria: "Tractores",
    marca: "John Deere",
    estado: "Nuevo",
    modelo3d: "https://res.cloudinary.com/pfskomq5/raw/upload/v1787352709/odfk5npmskuhczywryzv.glb",
    imagen: "https://www.deere.com.ar/assets/images/region-3/products/tractors/mid/6j-series/6115j/trator_6115j_campo_plantadeira_large_464239a53c1bef87af7b588dd43573de619ac4e3.jpg",
    descripcionCorta: "Versatilidad y durabilidad comprobada para tareas agrícolas y ganaderas.",
    descripcionLarga: "La Serie 6J representa la unión de la tecnología con la confiabilidad. Cuenta con un sistema hidráulico eficiente y transmisión versátil que lo hace perfecto para labores que requieren agilidad y robustez en el día a día del campo.",
    especificaciones: {
      "Potencia": "110 - 200 CV",
      "Transmisión": "PowrQuad o SyncroPlus",
      "Bomba Hidráulica": "110 o 155 L/min",
      "Cabina": "Climatizada con visión 360"
    }
  },
  {
    id: 6,
    nombre: "Cosechadora John Deere 1175",
    categoria: "Cosechadoras",
    marca: "John Deere",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402390/ppkewsxmkf0uwqi1tn7g.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402390/ppkewsxmkf0uwqi1tn7g.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402397/b8kssap68yfkjd1rk8fk.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402404/y3fxb8m99tqtpnw5vcer.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402408/av14dt0yih4iyt7daurs.jpg"
    ],
    descripcionCorta: "Cosechadora John Deere 1175 ideal para pequeños y medianos productores.",
    descripcionLarga: "Esta cosechadora John Deere se encuentra en excelentes condiciones operativas, lista para salir al campo. Equipada con motor John Deere potente y sistema de trilla de alta eficiencia que minimiza las pérdidas. Mantenimiento al día con repuestos originales.",
    especificaciones: {
      "Motor": "John Deere 6 cilindros turbo",
      "Potencia": "170 CV",
      "Plataforma": "19 pies",
      "Transmisión": "Mecánica"
    }
  },
  {
    id: 7,
    nombre: "Niveladora de Arrastre Grosspal",
    categoria: "Herramientas",
    marca: "Grosspal",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402419/x1wg1zq8imd7vfngga6h.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402419/x1wg1zq8imd7vfngga6h.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402424/k25oxx6foasoq5d1xgye.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402427/ejkahvzoqwlddskleka5.jpg"
    ],
    descripcionCorta: "Niveladora de arrastre Grosspal, robusta y eficiente para nivelación de suelos.",
    descripcionLarga: "Niveladora de arrastre Grosspal en óptimo estado de conservación y funcionamiento. Chasis ultra resistente diseñado para soportar las tareas de emparejamiento más exigentes. Sistema hidráulico completo funcionando sin pérdidas.",
    especificaciones: {
      "Marca": "Grosspal",
      "Modelo": "N-3",
      "Ancho de hoja": "3.6 metros",
      "Accionamiento": "Hidráulico completo"
    }
  },
  {
    id: 8,
    nombre: "Mixer TAURUS 250",
    categoria: "Herramientas",
    marca: "Taurus",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402433/maa4bg467sfmlvf8b2sn.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402433/maa4bg467sfmlvf8b2sn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402438/oodqg890vgwozmltfrbu.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402442/ojlbl2z485x8cs9guuv1.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402447/huruqftbpcdfxsov0ukf.jpg"
    ],
    descripcionCorta: "Mixer distribuidor de forraje Taurus, ideal para alimentación de ganado.",
    descripcionLarga: "Mixer Taurus diseñado para un mezclado uniforme y descarga rápida. Chasis reforzado y tolva con recubrimiento especial contra la corrosión. Sistema de sinfines de alta resistencia para un picado preciso y eficiente.",
    especificaciones: {
      "Capacidad": "10 m³",
      "Sistema de mezcla": "Sinfines horizontales",
      "Descarga": "Cinta transportadora lateral",
      "Rodado": "Para neumáticos rodado 16.5"
    }
  },
  {
    id: 9,
    nombre: "Acoplado Volcador Verde Agroguardati",
    categoria: "Acoplados",
    marca: "Agroguardati",
    estado: "Nuevo",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402470/mo2hvs0ddho0rrz9xnuk.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402470/mo2hvs0ddho0rrz9xnuk.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402482/nyt4veb3e0vhndlou7gj.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402488/yolik7givsohskvakgyb.jpg"
    ],
    descripcionCorta: "Acoplado volcador bi-vuelco de gran resistencia para múltiples cargas.",
    descripcionLarga: "Acoplado volcador nuevo fabricado con materiales de alta calidad. Capacidad de carga ideal para transporte de granos, tierra, herramientas y materiales diversos. Sistema de vuelco ágil y seguro.",
    especificaciones: {
      "Capacidad de Carga": "4.000 kg",
      "Tipo": "Bi-vuelco lateral",
      "Rodado": "Dual de 16 pulgadas",
      "Chasis": "Acero reforzado"
    }
  },
  {
    id: 10,
    nombre: "Sembradora Gherardi G-230",
    categoria: "Sembradoras",
    marca: "Gherardi",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402510/s8ovl0zxp1dnn297vzcj.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402510/s8ovl0zxp1dnn297vzcj.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402518/f40hw7j145gg1bhtwedh.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402525/g8mpzkhof5g068zgic0m.jpg"
    ],
    descripcionCorta: "Sembradora de granos finos y gruesos Gherardi en perfecto estado operativo.",
    descripcionLarga: "Sembradora de precisión Gherardi G-230. Ofrece una distribución de semilla uniforme con dosificadores regulables y tolvas de gran autonomía. Ideal para siembra directa con óptimo comportamiento en rastrojos pesados.",
    especificaciones: {
      "Líneas": "18 líneas a 52 cm",
      "Dosificación": "Placas mecánicas y neumáticas",
      "Tolvas": "Granos y fertilizante en línea"
    }
  },
  {
    id: 11,
    nombre: "Tractor Massey Ferguson 290",
    categoria: "Tractores",
    marca: "Massey Ferguson",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402541/dvio6rigjrsvutt3cqtd.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402541/dvio6rigjrsvutt3cqtd.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402550/i8dfhvdv0q1w4tljhxzk.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402555/qow7ylz3abvu39xx6sfr.jpg"
    ],
    descripcionCorta: "Tractor Massey Ferguson 290 clásico, robustez y economía de mantenimiento.",
    descripcionLarga: "Tractor Massey Ferguson 290 usado, ideal para labores secundarias del campo, ganadería o mantenimiento general. Mecánica simple y confiable con repuestos económicos y de fácil acceso.",
    especificaciones: {
      "Motor": "Perkins 4 cilindros",
      "Potencia": "85 CV",
      "Transmisión": "8 de avance + 2 de retroceso",
      "Tracción": "4x2"
    }
  },
  {
    id: 12,
    nombre: "Mini Tractor Corta Césped",
    categoria: "Tractores",
    marca: "Agroguardati",
    estado: "Usado",
    modelo3d: "https://res.cloudinary.com/pfskomq5/raw/upload/v1787354980/jxjwld9mj6mh4rttvdh3.glb",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786401866/qwfs3tmxa9azriapv6dc.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401866/qwfs3tmxa9azriapv6dc.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401876/fqcwnd5ufxxoszgwtjcd.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401881/mzl9mhww3xfbkswyn3hz.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401889/e2nv6vhncisb3ecuawol.jpg"
    ],
    descripcionCorta: "Mini tractor corta césped ideal para el mantenimiento de parques, jardines y grandes superficies.",
    descripcionLarga: "Mini tractor corta césped diseñado para brindar máxima comodidad y rendimiento en el mantenimiento de parques, áreas verdes y parquizados. Excelente maniobrabilidad, corte uniforme y motor confiable.",
    especificaciones: {
      "Tipo": "Mini tractor corta césped",
      "Uso": "Mantenimiento de parques y jardines",
      "Sistema de corte": "Plataforma de alta eficiencia",
      "Estado": "Excelente estado de conservación"
    }
  },
  {
    id: 13,
    nombre: "Tractor Case IH 205 HP con Piloto (8.000 hs)",
    categoria: "Tractores",
    marca: "Case IH",
    estado: "Usado",
    modelo3d: "https://res.cloudinary.com/pfskomq5/raw/upload/v1787355000/uuh9w49gomfwasjrhbn8.glb",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786401902/anvojddt5zt762sa9fyi.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401902/anvojddt5zt762sa9fyi.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401909/szzvrkvgcqp7dqxwnveo.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401913/stw6ps0dzxac5by8uj1v.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401918/d1x4diuspwofknxhvrbo.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401924/dj4c3uzviqax4mveeiwe.jpg"
    ],
    descripcionCorta: "Tractor Case IH de 205 HP equipado con piloto automático y 8.000 hs de trabajo.",
    descripcionLarga: "Tractor Case IH de 205 HP en excelente estado general. Cuenta con sistema de piloto automático incorporado para una agricultura de precisión óptima y 8.000 horas de uso comprobadas. Mantenimiento y servicios al día.",
    especificaciones: {
      "Potencia": "205 HP",
      "Marca": "Case IH",
      "Equipamiento": "Piloto Automático",
      "Horas de Uso": "8.000 hs",
      "Estado": "Usado en muy buen estado"
    }
  },
  {
    id: 14,
    nombre: "Tractor John Deere 3550 Doble Tracción",
    categoria: "Tractores",
    marca: "John Deere",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786401935/cdaymn64u3yfhaqstlda.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401935/cdaymn64u3yfhaqstlda.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401937/rdvklqguombi82eyxxao.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401942/jd4ofd7lkvzlzfobivqb.jpg"
    ],
    descripcionCorta: "Tractor John Deere 3550 con doble tracción y doble embrague en impecable estado.",
    descripcionLarga: "Tractor John Deere 3550 equipado con doble tracción (4x4) y sistema de doble embrague. Reconocido por su alta resistencia, fuerza de tiro y confiabilidad en las labores del campo. Se encuentra en excelente estado de conservación operativo.",
    especificaciones: {
      "Modelo": "John Deere 3550",
      "Tracción": "Doble Tracción (4x4)",
      "Embrague": "Doble embrague",
      "Marca": "John Deere",
      "Estado": "Excelente estado de conservación"
    }
  },
  {
    id: 15,
    nombre: "Tractor Zanello 230c Motor Cummins",
    categoria: "Tractores",
    marca: "Zanello",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786401954/l9hrobdgtkt4gnoczylt.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401954/l9hrobdgtkt4gnoczylt.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401961/lstc5jaftcqw5qehqig6.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401968/xgn5fx9azlkb26o3ylb3.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401975/tiv7mic7a9l0hxgysrgj.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786401989/uk5eac6bhkhczm7zfjud.jpg"
    ],
    descripcionCorta: "Tractor Zanello 230c con motor Cummins, año 1999. Muy buen estado, listo para trabajar.",
    descripcionLarga: "Tractor Zanello 230c equipado con motor Cummins de 130 HP. Cuenta con 9.000 horas de trabajo comprobadas. Unidad en muy buen estado de conservación y lista para incorporarse a las tareas del campo.",
    especificaciones: {
      "Motor": "Cummins 130 HP",
      "Año": "1999",
      "Horas de Trabajo": "9.000 hs",
      "Estado": "Usado en muy buen estado"
    }
  },
  {
    id: 16,
    nombre: "Desmalezadora Bernardin 3 M de Corte Nueva",
    categoria: "Herramientas",
    marca: "Bernardin",
    estado: "Nuevo",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402000/qrq78wnlwkdmbqvllssw.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402000/qrq78wnlwkdmbqvllssw.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402011/uwsakomlbecdwxmdr4ap.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402019/xn1esjesai23a4lemnvn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402027/kwtvsopnw0ti6espeeyn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402037/u0cmhtdpptablia2exkq.jpg"
    ],
    descripcionCorta: "Desmalezadora Bernardin con 3 metros de ancho de corte, año 2026. Unidad totalmente nueva.",
    descripcionLarga: "Desmalezadora Bernardin 0km con ancho de trabajo de 3 metros. Robusta estructura diseñada para desmalezado de alta exigencia, chasis reinforced y caja multiplicadora de alta durabilidad.",
    especificaciones: {
      "Marca": "Bernardin",
      "Ancho de corte": "3.00 metros",
      "Año": "2026",
      "Estado": "Nuevo (0 km)"
    }
  },
  {
    id: 17,
    nombre: "Tolva Cerealera Sola y Brusa (8 tn)",
    categoria: "Acoplados",
    marca: "Sola y Brusa",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402044/yiseqqqydf1vzw5m47a8.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402044/yiseqqqydf1vzw5m47a8.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402052/p8cmcvefhkd2zn1bel2f.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402067/xcehgq05pve45cleevkz.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402077/v4cqb8kn50hoovlvlsrf.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402083/iwxfp3gzs2h6zxomhqni.jpg"
    ],
    descripcionCorta: "Tolva cerealera Sola y Brusa de 8 toneladas de capacidad, año 1996. Excelente oportunidad.",
    descripcionLarga: "Tolva cerealera Sola y Brusa con capacidad para 8 toneladas. Chasis en muy buen estado, sin picaduras, tubo de descarga y balanza opcional. Ideal para cosecha y transporte de granos.",
    especificaciones: {
      "Marca": "Sola y Brusa",
      "Capacidad": "8 toneladas",
      "Año": "1996",
      "Estado": "Usado"
    }
  },
  {
    id: 18,
    nombre: "Acoplado Tanque Combinado 3000 Lts San Juan",
    categoria: "Acoplados",
    marca: "San Juan",
    estado: "Nuevo",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402092/uy6ytsthzwfktmn76f6o.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402092/uy6ytsthzwfktmn76f6o.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402094/hxbsznu1byzbux1iexig.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402102/tndtngs1kywdfekqevpv.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402107/rvhwoavco70m3tgq6rvn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402119/lhvuzzxsfnrrizgsbhhg.jpg"
    ],
    descripcionCorta: "Acoplado tanque combinado de 3.000 Lts para combustible y 750 Lts para agua con bauleras. Nuevo 2026.",
    descripcionLarga: "Acoplado tanque combinado fabricado por Plegados San Juan. Capacidad de 3.000 litros para combustible y tanque auxiliar de 750 litros para agua. Incluye dos bauleras laterales reforzadas. Unidad totalmente nueva.",
    especificaciones: {
      "Capacidad Combustible": "3.000 Litros",
      "Capacidad Agua": "750 Litros",
      "Equipamiento": "2 bauleras laterales",
      "Año": "2026",
      "Estado": "Nuevo (0 km)"
    }
  },
  {
    id: 19,
    nombre: "Niveladora TBEH N6 2R",
    categoria: "Herramientas",
    marca: "TBEH",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402126/zyjjwszguqwlfy2fkufc.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402126/zyjjwszguqwlfy2fkufc.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402130/jjcxod1ad3clhbh0hlas.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402139/dp1wwck3qwuhc6fh8ss7.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402147/bsoawqf1zadcasbjjazd.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402156/w1pukghhwn05glj1dhyl.jpg"
    ],
    descripcionCorta: "Niveladora TBEH N6 2R año 2020. Muy poco uso y en impecable estado general.",
    descripcionLarga: "Niveladora de arrastre TBEH modelo N6 2R. Año 2020 con muy poco uso. Chasis reforzado de alta estabilidad, rodado doble y accionamiento hidráulico completo. Impecable estado operativo.",
    especificaciones: {
      "Marca": "TBEH",
      "Modelo": "N6 2R",
      "Año": "2020",
      "Estado": "Usado en muy buen estado"
    }
  },
  {
    id: 20,
    nombre: "Lancha Guadalupe 470 Inscripta con Tráiler",
    categoria: "Embarcaciones",
    marca: "Guadalupe",
    estado: "Usado",
    modelo3d: "https://res.cloudinary.com/pfskomq5/raw/upload/v1787353064/xpbgd1xkumzy43qnai9d.glb",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402161/qnwi8kqll7iansypluys.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402161/qnwi8kqll7iansypluys.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402167/nftdq7qth1hstrug1f3k.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402179/q1flynusdiaa66jff5xn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402182/ovb0e5rdddlv7r9kunbn.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402193/xvdm1dcuq9z23bl6yoib.jpg"
    ],
    descripcionCorta: "Tracker Guadalupe 470 Full año 2023 con tráiler completo, luces y posa cañas. Súper liviano y resistente.",
    descripcionLarga: "Tracker Guadalupe 470 Full en Honeycomb color rojo y blanco. Equipada con 6 posa cañas, bolsillos laterales, tráiler completo con paragolpes y luces. Embarcación super liviana, resistente e inscripta.",
    especificaciones: {
      "Modelo": "Guadalupe 470 Full",
      "Material": "Honeycomb",
      "Año": "2023",
      "Equipamiento": "6 posa cañas, tráiler con luces",
      "Estado": "Usado impecable"
    }
  },
  {
    id: 21,
    nombre: "Inoculador Mezclador Micelli",
    categoria: "Herramientas",
    marca: "Micelli",
    estado: "Usado",
    imagen: "https://res.cloudinary.com/pfskomq5/image/upload/v1786402200/jx9xrcpojedvhe42lycf.jpg",
    imagenes: [
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402200/jx9xrcpojedvhe42lycf.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402209/xvbpyqlj8apkudq0zmcl.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402215/zo7jotmpanai2qwqdean.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402223/pl2xb79st3nqncdakegl.jpg",
      "https://res.cloudinary.com/pfskomq5/image/upload/v1786402226/yzsesdxwgzbidsxvdufw.jpg"
    ],
    descripcionCorta: "Inoculador mezclador Micelli año 2019 en muy buen estado general.",
    descripcionLarga: "Inoculador mezclador de semillas Micelli año 2019. Equipo diseñado para un tratamiento rápido y uniforme de semillas previo a la siembra. Excelente estado de conservación y listo para usar.",
    especificaciones: {
      "Marca": "Micelli",
      "Tipo": "Inoculador Mezclador de Semillas",
      "Año": "2019",
      "Estado": "Usado en muy buen estado"
    }
  }
];
