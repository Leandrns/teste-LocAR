## Projeto de Teste - AR com Javascript

Segue os links do repositório, com todo o código comentado, e da aplicação hospedada no Vercel: <br>
https://github.com/Leandrns/teste-LocAR (o código fonte está em src > main.js) <br>
https://teste-loc-ar.vercel.app/ <br><br>
Esse projeto tem o objetivo de aplicar os conceitos iniciais das bibliotecas LocAR.js e Three.js, como a introdução de elementos em uma cena com base em localização, manipulação de iluminação da cena, importação de modelos 3D em arquivo .glb e execução de animações.
A aplicação conta com seguintes características:
- Carregamento de um modelo 3D de um flamingo (exemplo disponibilizado no próprio Three.js) utilizando um objeto loader GLTF do Three.js;
- Adição do modelo a uma cena usando o método .add() do objeto LocationBased, passando a localização atual do dispositivo como referência;
- Execução das animações do modelo (caso existam) a partir de um objeto AnimationMixer, que também faz parte do Three.js;
- Ao usar a aplicação, espera-se ver, em alguma direção da câmera, um flamingo fazendo uma animação de bater asas e ele rodará em seu próprio eixo Y. <br><br>
### Observações:
- Neste momento, o código só é capaz de carregar modelos 3D que tenham em sua hierarquia apenas meshes (malhas) e animações. Caso o modelo tenha também um material específico ou outros características, o objeto não é renderizado.
