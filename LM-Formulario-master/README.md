# LM-Formulario

Link del rawgit:https://rawgit.com/JuanAntonioBieto/LM-Formulario/master/Principal.html

## El formulario está divido en:

## Página principal

### La página principal contiene:

Un logo que representa a la página.

Una parte que se utiliza como menú y tiene 3 botones: 

Botón información: muestra la información y oculta la pestaña de examen o about si estaban siendo mostradas.

Botón examen: muestra las instrucciones y el link hacia el examen, aparte de ocultar la pestaña de información y about si estaban siendo mostradas.

Botón about: muestra quien es el creador de la página, aparte de ocultar la pestaña de información y about si estaban siendo mostradas.

Y una parte en la cual se muestra la información según la pestaña que estemos: información,examen,about.

### La página que contiene el formulario tiene:

Un logo que representa al formulario.

Un contenedor que contiene 10 preguntas de diferente tipo que vienen del link de rawgit del xml:

- 2 preguntas de tipo texto.
- 2 preguntas de tipo select.
- 2 preguntas de tipo select multiple.
- 2 preguntas de tipo checkbox.
- 2 preguntas de tipo radio.

Gestionar xml: guarda las respuestas, los títulos y las opciones de las preguntas con un bucle para cada tipo.

Imprimir xml: coge los títulos y las opciones ya guardadas con el gestionar xml, y las imprime.

Comprobar respuestas: comprueba si todas las preguntas han sido respondidas, si no lo están no te deja corregir. Estas obligado a contestar todas las preguntas.

Corregir repuestas: mira si la respuesta que has puesto concuerda con la respuesta del xml, si está bien te suma 1 punto, los tipo checkbox y tipo multiple restan puntos.

Mostrar nota: Oculta el contenedor de las preguntas, y nos muestra un contenedor con las preguntas correctas y incorrectas con su respectiva puntuación y un botón que nos permite tener una página principal.

### Otros

La página principal y la del formulario utilizan diferentes documentos javascript para evitar errores.
