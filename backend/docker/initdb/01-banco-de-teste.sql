-- Executado só na primeira criação do contêiner: banco separado para os testes
-- automatizados, para que eles nunca apaguem os dados de desenvolvimento.
CREATE DATABASE agora_test OWNER agora;
