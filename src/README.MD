# Como rodar

## O que será necessário?

Para o funcionamento do nosso sistema, você precisara das seguintes tecnologias:

1. [Git](https://git-scm.com/downloads): Utilizaremos o Git para clonar o nosso repositório.

2. [VSCode](https://code.visualstudio.com/download): Utilizaremos o VSCode para rodar o nosso sistema.


## 1º Passo: Clonando o repositório

<details>
  <summary><b>Clique aqui</b></summary>

  Para clonar e utilizar o nosso projeto e utilizá-lo em seu computador, siga os seguintes passos:
  
  1. Crie uma pasta onde deseja armazenar nosso projeto, e então abra-a e clique na url da pasta, ou então utilize o atalho `Ctrl+L` para selecionar a url, e escreva 'cmd' para abrir o prompt de comando.

  Um prompt de comando irá se abrir, e então execute o comando abaixo:
  
  ```
  git clone https://github.com/EquipeSkyfall/API_2Semestre.git .
  ``` 

</details>
<br>

## 2º Passo: Abrindo-o com o VSCode

<details>
  <summary><b>Clique aqui</b></summary>

  1. Após a clonagem, abra o seu VSCode e siga os seguintes passos:

  ```
> Clique em "FILE" no canto superior esquerdo
> Clique em "Open Folder" e selecione a pasta que você acabou de criar
  ```
</details>
<br>

## 3º Passo: Configurando o backend

<details>
  <summary><b>Cliqui aqui</b></summary>


  1. Com o repositório aberto, você ira clicar na pasta chamada "src" e logo depois na pasta chamada "backend", lá você irá abrir o arquivo ".env" e seguir os passos escritos lá

  2. Após configurar sua ".env", iremos fazer nosso banco de dados funcionar, abra um terminal novo apertando CTRL+SHIFT+' la, você devera ir até a pasta de destino no terminal:


```
cd .\src\
cd .\backend\
```
   3. Agora, após entrarmos na pasta backend pelo terminal, você deverá digitar as seguintes coisas no terminal:

```
npm i
npx prisma generate
npx prisma migrate dev
npx nodemon server.ts  
```

  </details>
  <br>

## 4º Passo: Abrindo o sistema

<details>
  <summary><b>Clique aqui</b></summary>

  1. Para abrir nossa aplicação, abra um novo terminal (CTRL+SHIFT+' novamente) e vá para o diretório frontend:

  ```
  cd .\src\
  cd .\frontend\
  ```

  2. Por fim, digite o seguinte comando no novo terminal:
  ```
  npm i
  npm run dev
  ```
  Após dar esse comando no novo terminal, basta entrar nesse link: <a href="http://localhost:5173">http://localhost:5173</a>

  3. Após finalizar o uso do serviço, basta usar o comando `Ctrl+C` em ambos os terminais para finalizar o serviço.
</details>
<br>

→ [Voltar ao topo](#topo)
