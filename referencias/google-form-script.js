/**
 * Script para crear el Google Form de relevamiento de necesidades.
 * 
 * INSTRUCCIONES:
 * 1. Ir a https://script.google.com
 * 2. Crear un nuevo proyecto (clic en "Nuevo proyecto")
 * 3. Borrar el contenido del editor y pegar este script completo
 * 4. Clic en "Ejecutar" (botón ▶) con la función "crearFormulario" seleccionada
 * 5. Aceptar los permisos que pide
 * 6. El formulario se crea en tu Google Drive. El link aparece en el log (Ver > Registros)
 *
 * NOTA: Si usás cuenta institucional @workspace.pjm.gob.ar, el form quedará
 * asociado a esa cuenta y podés restringir respuestas a usuarios del dominio.
 */

function crearFormulario() {
  var form = FormApp.create('Asistente Inteligente de Jurisprudencia — Relevamiento de necesidades');
  
  form.setDescription(
    'Poder Judicial de Mendoza — Dirección de Informática — Julio 2026\n\n' +
    '¿DE QUÉ SE TRATA ESTO?\n\n' +
    'Estamos evaluando incorporar una nueva funcionalidad al buscador de jurisprudencia: ' +
    'un asistente que pueda ejecutar tareas complejas por usted.\n\n' +
    'Hoy, cuando necesita encontrar y analizar jurisprudencia, el trabajo pesado lo hace usted. ' +
    'Busca, lee, vuelve a buscar, compara mentalmente, y al final arma la síntesis. ' +
    'El sistema le devuelve documentos, pero el esfuerzo de cruzar, filtrar, comparar y compilar es suyo.\n\n' +
    'Lo que estamos evaluando es darle al sistema la capacidad de hacer esa parte mecánica. ' +
    'No reemplazar su criterio, sino que el sistema haga la búsqueda y compilación, ' +
    'y usted valide el resultado.\n\n' +
    'EJEMPLOS de lo que podría pedirle al sistema:\n' +
    '• "Buscame las sentencias del Dr. Adaro sobre despido indirecto del último año y compilame su criterio"\n' +
    '• "¿Hay jurisprudencia que contradiga mi postura sobre X?"\n' +
    '• "¿Cómo evolucionó el criterio de la Suprema Corte sobre enfermedad profesional desde 2022?"\n' +
    '• "Comparame cómo resuelve la Cámara Civil vs. la Cámara Laboral en daño moral"\n\n' +
    'Antes de construir esto, necesitamos entender qué tareas le consumen más tiempo. ' +
    'Le pedimos unos minutos para responder. No hay respuestas correctas o incorrectas.\n\n' +
    'Tiempo estimado: 10-15 minutos.'
  );

  form.setConfirmationMessage(
    '¡Gracias por su tiempo! Sus respuestas nos ayudan a construir algo que realmente le sirva.\n' +
    'Cualquier consulta adicional: mryan@workspace.pjm.gob.ar'
  );

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 1: Su trabajo con jurisprudencia hoy
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Su trabajo con jurisprudencia hoy');

  form.addMultipleChoiceItem()
    .setTitle('1. ¿Con qué frecuencia necesita buscar jurisprudencia?')
    .setChoiceValues(['Varias veces al día', 'Una vez al día', '2-3 veces por semana', 'Una vez por semana', 'Esporádicamente'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. ¿Cuánto tiempo le lleva típicamente encontrar la jurisprudencia que necesita?')
    .setChoiceValues(['Menos de 15 minutos', '15-30 minutos', '30 min - 1 hora', '1-2 horas', 'Más de 2 horas'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('3. ¿Dónde busca jurisprudencia hoy? (Marque todas las que apliquen)')
    .setChoiceValues([
      'Sistema interno del Poder Judicial',
      'Bases de datos online (La Ley, Thomson Reuters, etc.)',
      'Google / buscadores web',
      'Archivos personales (carpetas, Word, PDF guardados)',
      'Consulta a colegas',
      'Memoria propia',
      'Otro'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('4. ¿Tiene archivos personales donde guarda jurisprudencia útil? ¿Cómo los organiza?')
    .setHelpText('Ej: carpetas por tema, planilla Excel, favoritos en el navegador, etc.');

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 2: Tareas que le llevan más tiempo
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Tareas que le llevan más tiempo');

  form.addParagraphTextItem()
    .setTitle('5. ¿Alguna vez necesitó cruzar información de varias sentencias? ¿Cómo lo hizo?')
    .setHelpText('Ej: comparar criterios, identificar patrones, compilar un estado del arte')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6. ¿Necesita rastrear cómo evolucionó un criterio judicial a lo largo del tiempo?')
    .setChoiceValues(['Frecuentemente', 'A veces', 'Rara vez', 'Nunca'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('7. ¿Necesita buscar jurisprudencia que contradiga su posición (para anticipar argumentos)?')
    .setChoiceValues(['Frecuentemente', 'A veces', 'Rara vez', 'Nunca'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('8. ¿Prepara informes o compilaciones de jurisprudencia sobre un tema?')
    .setChoiceValues(['Frecuentemente', 'A veces', 'Rara vez', 'Nunca']);

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 3: Filtros y criterios de búsqueda
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Filtros y criterios de búsqueda');

  form.addCheckboxItem()
    .setTitle('9. ¿Por qué criterios le gustaría poder filtrar? (Marque todos los útiles)')
    .setChoiceValues([
      'Juez/Vocal que intervino',
      'Fuero (laboral, civil, penal, familia, etc.)',
      'Tribunal (Suprema Corte, Cámara, Juzgado)',
      'Materia o tema',
      'Rango de fechas',
      'Resultado del fallo (hizo lugar, rechazó, revocó, confirmó)',
      'Norma o artículo citado (ej: art. 245 LCT)',
      'Número de expediente',
      'Voces / descriptores del tesauro'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('10. ¿Le importa quién fue el juez que resolvió? ¿En qué casos?')
    .setHelpText('Ej: para conocer su criterio habitual, para citar ante ese mismo juez, etc.');

  form.addCheckboxItem()
    .setTitle('11. ¿Qué rangos de fechas le son más útiles?')
    .setChoiceValues([
      'Último mes',
      'Últimos 6 meses',
      'Último año',
      'Últimos 3 años',
      'Últimos 5 años',
      'Sin límite de fecha'
    ]);

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 4: Lo que le pediría a un asistente dedicado
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Lo que le pediría a un asistente dedicado');

  form.addParagraphTextItem()
    .setTitle('12. Si tuviera una persona dedicada a buscar jurisprudencia para usted, ¿qué le pediría? Dé ejemplos concretos.')
    .setHelpText('Esta es la pregunta más importante. Piense en su día a día real.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('13. Cuéntenos la última vez que le costó encontrar jurisprudencia. ¿Qué buscaba y cómo lo resolvió?')
    .setRequired(true);

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 5: Priorización de funcionalidades
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('¿Qué funcionalidades le serían más útiles?')
    .setHelpText('Califique del 1 al 5 qué tan útil le resultaría cada funcionalidad. 1 = nada útil, 5 = muy útil.');

  var escala = form.addGridItem();
  escala.setTitle('14. Califique cada funcionalidad (1 = nada útil, 5 = muy útil)');
  escala.setRows([
    'A. Compilar el criterio de un juez sobre un tema',
    'B. Rastrear cómo cambió la jurisprudencia sobre un tema en el tiempo',
    'C. Buscar precedentes que contradigan una postura',
    'D. Armar un panorama completo de jurisprudencia sobre un tema',
    'E. Comparar cómo resuelven distintos tribunales un mismo tema',
    'F. Alertas cuando salga jurisprudencia nueva sobre un tema que trabajo',
    'G. Saber qué normas/artículos se citan más en un tipo de caso',
    'H. Dimensionar cuántas sentencias hay sobre un tema',
    'I. Identificar el fallo "líder" o más citado sobre un tema',
    'J. Detectar si un juez cambió de criterio recientemente'
  ]);
  escala.setColumns(['1', '2', '3', '4', '5']);
  escala.setRequired(true);

  form.addParagraphTextItem()
    .setTitle('15. ¿Hay alguna otra tarea que le gustaría poder delegarle al sistema?')
    .setHelpText('Cualquier cosa que no hayamos mencionado arriba');

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 6: Formato de entrega
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Cómo le gustaría recibir los resultados');

  form.addCheckboxItem()
    .setTitle('16. Si el sistema le compila un informe, ¿cómo lo prefiere?')
    .setChoiceValues([
      'Resumen ejecutivo breve (1-2 párrafos)',
      'Informe detallado con citas textuales',
      'Tabla comparativa',
      'Listado de sentencias con links a los PDFs originales',
      'Texto listo para copiar/pegar en mi resolución'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('17. ¿Le gustaría ver los pasos que hizo el sistema para llegar al resultado?')
    .setHelpText('Ej: "Busqué 15 sentencias, leí 4 completas, compilé el análisis"')
    .setChoiceValues([
      'Sí, me da más confianza ver el proceso',
      'Me es indiferente',
      'No, solo quiero el resultado final'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('18. ¿Le gustaría poder refinar el resultado conversando con el sistema?')
    .setHelpText('Ej: "Muy bien, pero ahora filtrá solo las de 2025" o "Profundizá en el punto 3"')
    .setChoiceValues(['Sí, sería muy útil', 'Tal vez', 'No me interesa']);

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 7: Confianza en el sistema
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Confianza en el sistema');

  form.addMultipleChoiceItem()
    .setTitle('19. ¿Qué nivel de verificación haría sobre un compilado generado por el sistema?')
    .setChoiceValues([
      'Lo usaría directamente sin revisar',
      'Leería el resumen y verificaría 1-2 citas al azar',
      'Verificaría todas las citas contra el PDF original',
      'Solo lo usaría como punto de partida para mi propia búsqueda'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('20. ¿Qué le daría confianza en que el sistema no inventa citas?')
    .setChoiceValues([
      'Link directo al PDF de cada sentencia citada',
      'Número de expediente verificable',
      'Fragmento textual exacto de la sentencia',
      'Indicación de la página del PDF donde está el fragmento',
      'Que me diga cuándo NO encontró jurisprudencia en vez de inventar',
      'Que me diga de cuántas sentencias extrajo la información'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('21. ¿Qué le preocupa más?')
    .setChoiceValues([
      'Que me traiga cosas irrelevantes (ruido)',
      'Que se le escape jurisprudencia importante (omisión)',
      'Ambas por igual'
    ]);

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 8: Para cerrar
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Para cerrar');

  form.addParagraphTextItem()
    .setTitle('22. ¿Qué es lo que más le frustra del proceso actual de búsqueda de jurisprudencia?')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('23. ¿Hay algo que hoy resuelve "de memoria" o preguntando a colegas que le gustaría que el sistema pudiera resolver?');

  form.addParagraphTextItem()
    .setTitle('24. ¿Algún comentario, sugerencia o inquietud adicional?');

  // ═══════════════════════════════════════════════════════════════
  // SECCIÓN 9: Datos del encuestado
  // ═══════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('Sus datos (nos ayuda a contextualizar las respuestas)');

  form.addMultipleChoiceItem()
    .setTitle('Fuero en el que trabaja')
    .setChoiceValues(['Laboral', 'Civil', 'Penal', 'Familia', 'Administrativo', 'Tributario', 'Otro'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Rol')
    .setChoiceValues(['Juez/a', 'Secretario/a', 'Prosecretario/a', 'Letrado/a', 'Relator/a', 'Otro'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Antigüedad en el cargo')
    .setChoiceValues(['Menos de 2 años', '2-5 años', '5-10 años', '10-20 años', 'Más de 20 años']);

  form.addMultipleChoiceItem()
    .setTitle('¿Usa habitualmente herramientas digitales para buscar jurisprudencia?')
    .setChoiceValues(['Sí, todos los días', 'Sí, algunas veces', 'Poco', 'Casi nunca']);

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN FINAL
  // ═══════════════════════════════════════════════════════════════
  form.setProgressBar(true);
  form.setPublishingSummary(false);
  form.setAllowResponseEdits(true);
  form.setLimitOneResponsePerUser(true);

  // Log del link al formulario
  Logger.log('═══════════════════════════════════════════════════');
  Logger.log('✅ Formulario creado exitosamente!');
  Logger.log('');
  Logger.log('📋 Link para editar: ' + form.getEditUrl());
  Logger.log('📨 Link para compartir: ' + form.getPublishedUrl());
  Logger.log('');
  Logger.log('Compartí el link "para compartir" con los usuarios.');
  Logger.log('═══════════════════════════════════════════════════');
}
