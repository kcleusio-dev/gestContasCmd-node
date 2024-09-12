//modulos externos
import inquirer from "inquirer";
import chalk from "chalk";

//modulos internos
import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Levantar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      if (action === "Criar Conta") {
        createAccount();
      } else if (action === "Consultar Saldo") {
        getAccountBalance();
      } else if (action === "Depositar") {
        depositar();
      } else if (action === "Levantar") {
        withdraw();
      } else if (action === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o nosso Banco...!"));
        process.exit();
      }
    })
    .catch((error) => console.log(error));
}

//função criar conta

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por usar o nosso Banco..."));
  console.log(chalk.green("Defina as opções da sua conta a seguir..."));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome/número para a sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black(
            "Está conta já existe, escolhe outro número/nome..."
          )
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"Balance" : 0}',
        function (err) {
          console.log(err);
        }
      );
      console.log(chalk.green("Parabéns a sua conta foi criada com sucesso.."));
      operation();
    })
    .catch((err) => console.log(err));
}

// add an amount to user account
function depositar() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verify if account exists
      if (!checkAccount(accountName)) {
        return depositar();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          // add an amount
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Esta conta não existe, tente novamente!"));
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    S;
    return depositar();
  }
  accountData.Balance = parseFloat(amount) + parseFloat(accountData.Balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(
    chalk.green(
      `Foi depositado o valor de AOA ${amount} na sua conta ${accountName}!`
    )
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}

//show balance

function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual a sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verificar se conta existe
      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }
      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.black(
          `Olá, o saldo da sua conta é AOA ${accountData.Balance}`
        )
      );
      operation();
    })
    .catch((err) => console.log(err));
}

function withdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual a sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return withdraw();
      }
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto deseja levantar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          removeAmount(accountName, amount);
          //operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    return withdraw();
  }

  if (accountData.Balance < amount) {
    console.log(chalk.bgRed.black("valor indisponivel!"));
    return withdraw();
  }

  accountData.Balance = parseFloat(accountData.Balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    chalk.green(
      `Foi realizado o levanamento de ${amount} na sua conta ${accountName}`
    )
  );
  operation();
}

//Implementar transferência conta-conta
