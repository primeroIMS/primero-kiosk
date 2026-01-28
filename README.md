# Primero Kiosk

## Development

> [!NOTE]
> If you are already an experienced Rails developer and are familiar with Docker, grab a copy of the code from [github](https://github.com/primeroIMS/primero-kiosk) and skip to the section [Building the Containers](#building-the-containers).

In order to contribute to Primero-kiosk, you need a working development environment. It is recommended to use a Mac or Linux operating system. If you are developing on Windows, you should consider using WSL or a VM.

The instructions in this guide assume that you are running Ubuntu Linux. Primero-kiosk supports both x86_64 and arm64 architectures, so if you're using an M1 Mac or another arm64 machine like a Raspberry Pi, you don't need to do anything special. If you are using a different Linux distribution or MacOS, you will need to adapt the instructions accordingly.

## Cloning the Primero Kiosk Repository

To get a fresh copy of the code, you need to have [git](http://git-scm.com/book/en/v2/Git-Internals-Packfiles) installed.

```bash
sudo apt update
sudo apt install git
```

Navigate to a directory in your shell where you would like to download Primero-kiosk, and clone the repository.

```bash
git clone https://github.com/primeroIMS/primero-kiosk.git
```

As most of the time you will be targeting the `develop` branch, you should switch to that branch now.

```bash
cd primero-kiosk
git checkout develop
```

# Installing Dependencies
## Installing Ruby using `rbenv`

> [!NOTE]
> If you already have a solution that you like, such as rvm, asdf, or RTX, there is no reason to switch. You will just need to use them to install the correct runtimes.

> [!WARNING]
> The version of rbenv packaged with Ubuntu and Debian is out-of-date. You will need to install it according to the steps below, rather than use the version provided by apt.

`rbenv` is a version manager and installer for ruby runtimes. It allows you to install the correct version of ruby for each project that you are working on.

In order to install ruby using `rbenv`, you will need to install the following dependencies, which are used to build ruby from source.

```bash
sudo apt install curl g++ gnupg2 gcc autoconf automake bison libc6-dev libffi-dev libgdbm-dev libncurses5-dev libsqlite3-dev libtool libyaml-dev make pkg-config sqlite3 zlib1g-dev libgmp-dev  libreadline-dev libssl-dev
```

You will then need to install `rbenv` as well as `ruby-build`. There is a convenience script provided by `rbenv` that will help to install them.

```bash
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
```

The convenience script does not modify your `.bashrc` file. You need to update it manually with the snippet below. If you use another shell such as zsh, you will need to edit the correct startup file.

```bash
echo 'export PATH="$PATH:~/.rbenv/bin"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
```

In the Primero-kiosk top-level directory, there is a file `.ruby-version`, which contains the correct version of ruby to install. Install the correct version as follows:

```bash
cat .ruby-version
# This will print something like: ruby-3.3.8
# rbenv needs the version number, but not the ruby- prefix.
rbenv install $(cat .ruby-version)
```

It will take several minutes to build and install ruby, depending on the speed of your machine.
Once you have succeeded in installing ruby, it is worth checking that you are now using the right version.

```bash
ruby --version
# This should print something like: ruby 3.3.8 (or whatever the current version in the .ruby-version is)
```

## Installing node using `nvm`

>[!note]
>Like rbenv, nvm is a version manager which will manage node installations on your machine. If you already have an alternative tool for managing node versions, you can use that instead. Simply get a copy of the LTS version of node and you should be good to go.

`nvm` is a version manager for node runtimes. It is similar to rbenv, but manages node rather than ruby.

`nvm` has a convenience script which will install it automatically. It should also automatically update your shell startup file.

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

In order to start using `nvm`, you will need to close and reopen your terminal.

To install the version of node needed by primero-kiosk, run the following command:
```shell
nvm install --lts
```

Afterward you need [pnpm](https://pnpm.io/) Pnpm has a few different methods of installing the package manager. The recommended way is running the following

``` shell
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## For more docker instructions

For detailed Docker setup instructions, see the [Docker README](docker/README.md).

# Configuring  for Local Development

Primero-kiosk is partially configured with a number of yaml files. There are example versions of these files provided for local development. They need to be copied to the correct locations in order for Primero-kiosk to function.

Execute these from the root directory of the repository. You may want to review these files and potentially make changes to them once they have been copied.
```bash
cp config/database.yml.development config/database.yml
cp config/locales.yml.development config/locales.yml
mkdir log
```

You will also need to install some system-wide dependencies required to build and run Primero-kiosk.

```bash
sudo apt install libpq-dev libvips42 libsodium-dev p7zip
```

Note that versions of Primero-kiosk previous to v2.15.0 used `imagemagick` instead of `libvips42` for image processing. If you wish to maintain older versions, you will need to install it.

```bash
sudo apt install imagemagick
```

Execute the following to install Primero-kiosk's ruby and node dependencies:

```bash
bundle install
pnpm install
```

You now need to create the two Postgres databases (the default database, and a database used for unit testing). Primero-kiosk does not setup postgres. You should connect to a local or remote postgres server.

```shell
rails db:create
rails db:migrate

RAILS_ENV=test rails db:migrate
```

You also need to generate the translation files.

```shell
rails primero_kiosk:i18n_js
```

Finally, you need to set a number of environment variables which contain necessary secrets.

The environment variables are:
- PRIMERO_SECRET_KEY_BASE

The following bash command will generate a secure secret for each of these and add them to your `~/.bashrc`:

```bash
for v in PRIMERO_SECRET_KEY_BASE;
do echo "export ${v}=$(openssl rand -hex 16)" >> ~/.bashrc;
done;
```

If you use a different shell, for example zsh, you will need to add these to the correct startup file.

# Running Unit Tests

To make sure that your system has been configured correctly, and to establish a baseline of the unit tests passing on your environment, it is a good idea to run the unit tests before making any changes to the Primero-kiosk code. This may take a few minutes. On a VM with 4GB of RAM, it will take approximately 5 minutes to run the tests.

Ruby/Rails unit tests:

```shell
rspec spec
```

Typescript/NPM unit tests:
```shell
npm run test
```


There should be no failures in the unit tests on a clean clone from the `develop` branch or main branch.
# Running  Locally

For this, you will want to create two different terminal tabs/windows. In one, run the following, which will build and serve the frontend application:

```shell
bin/vite dev
```

In the other window, run the following command, which will run the rails server that hosts the Primero-kisok backend.

```bash
rails s
```

Visit http://localhost:3000/ in your browser.

Alternatively you can install [overmind](https://github.com/DarthSim/overmind) and run `overmind s`. This will start both the front-end and back-end. 

Overmind requires tmux. In another terminal tab, you can use `overmind connect [process-name]`  example: `overmind connect web` to connect to the tmux window for that task. Use `Ctrl + b` then `d` to disconnect.

# Running Linters - RuboCop & ESLint

Primero-kiosk uses two linters, RuboCop for the Ruby code, and `ESLint` for the JavaScript code.

Linting is enforced by the development team for all files in the `app` directory. You should run the linters and fix any errors before making a Pull Request, and ideally before every commit. There are tools such as [pre-commit](https://pre-commit.com) that can automatically do this for you, but their use is outside the scope of this guide.

To invoke RuboCop on all files in the `app/` directory:

```shell
rubocop -c .rubocop.yml app
```

To invoke RuboCop on a specific file, and auto-fix where possible:

```shell
rubocop -c .rubocop.yml -A <PATH TO FILE.rb>
```

To invoke RuboCop on all relevant files changed on your local branch:

```bash
git diff --cached origin/develop --name-only | grep -e "\.rb$" | grep -wv "db/*" | xargs rubocop -c .rubocop.yml
```

To run ESLint:

```bash
pnpm run lint
```
