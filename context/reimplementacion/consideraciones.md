cosas a tener en cuenta en la reimplementación:

- se puede comenzar reformateando los recursos actuales! Están en formato dat en su mayoría (que se leen tipo documento .ini de windows), pero esto es muy desactualizado. Actualizar esos formatos a algo mas manejable! Supongo que json, o alguna otra alternativa que creas mejor y que mantenga performance.

- el juego tiene ciertos limites, como cantidad maxima de hechizos aprendidos, o cosas así, que no tienen sentido que los siga teniendo!.

- el mundo es un conjunto de mapas de 100 x 100. Pero yo quiero un mundo continuo! Que el usuario no vea esa diferencia fea de pasar de un mapa a otro, pero si obviamente que los NPCs se mantengan en los limites de su mapa, y no se vayan mucho mas lejos. (Podrían pasarse unos cuantos tiles para que no sea tan antinatural... pero luego se tienen que volver)

- el sistema de areas es anticuado y muy susceptible a fallos. Que sistema de manejo de envio de información por zonas recomiendas? (algo que se utilice en la industria de juegos 2D con mapas muy grandes y muchos jugadores). Habia leido algo sobre quadtree, no se si esto viene al solucionar este problema y si es lo mas recomendado.

- mas alla de la separacion de responsabiliades propuesta en el server, crees que vale la pena hacer una estructura de microservicios que separen distintas responsabilidades, y se comuniquen de alguna forma? (event loop moderno). De tal manera que si algo necesita mas procesamiento se pueda escalar horizontalmente? este sistema por events puede generar lag? como se debe manejar? ten en cuenta que NO quiero algo tan overkill ni sobreingenieria. No va a tener tantos usuarios pero NO quiero que jamas genere lag, caidas masivas, etc.

- hay manera de evitar ataques DOS? con microservicios se puede lograr esto?

- si estas de acuerdo con lo anterior, en cuantas APPS separarias el server y con que responsabilidad para cada una?

- concepto de worldsave! no me gusta! es algo viejo. La info tendria que guardarse de forma asíncrona frecuentemente, sin afectar la performance del juego para nada! esto es posible?

- quiero ir implementando el servidor y cliente de a poco, feature por feature, y siempre tener versiones funcionales e incrementales.

- en base a toda la WIKI, como veras hay muchas reglas de negocio, cosas complejas, si pasa algo entonces triggerea otra cosa, precondiciones para hacer cosas, y bastante interación entre todo contra todo. Quiero evitar caer en codigo imperativo que repita un monton de IFs y lineas para chequear todo por todos lados y que se convierta en codigo spaguetti. Hay algun patron arquitectonico que pueda ayudar con esto para la reimplementacion? en el archivo ./arquitectura_patrones.md ya me has dado una idea, la cual es usar una Arquitectura Hibrida basada en Rules + Events + Specifications.

- el protocolo actual (mensajes cliente <-> server) CREO que puede estar mal organizado y tener cosas de mas o ineficientes! quizas hay cosas que hoy estan del lado del cliente pero que deberían estar del lado del servidor.
y viceversa! cosas del servidor que deberian estar del lado del cliente (algunos mensajes hacia el cliente o algo asi?).

- el sistema de caminata no es 100% certero! ante lag los usuarios pueden empezar a tener una posicion incorrecta. La cual se ajusta presionando la tecla L. Esto NO es una buena experiencia.... que sistema de caminata sugieres para que se controle desde el server, no haya velocidad desde el cliente, y No se genere lag ni inconsistencias?