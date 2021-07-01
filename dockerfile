FROM mcr.microsoft.com/windows/servercore:1809 as installer

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';$ProgressPreference='silentlyContinue';"]

RUN Invoke-WebRequest -OutFile nodejs.zip -UseBasicParsing "https://nodejs.org/dist/v12.4.0/node-v12.4.0-win-x64.zip"; Expand-Archive nodejs.zip -DestinationPath C:\; Rename-Item "C:\\node-v12.4.0-win-x64" c:\nodejs

FROM mcr.microsoft.com/windows/nanoserver:1809

WORKDIR C:/nodejs
COPY --from=installer C:/nodejs/ .
RUN SETX path C:\nodejs
RUN npm config set registry https://registry.npmjs.org/

WORKDIR /app

# install and cache app dependencies
COPY package.json package-lock.json ./


RUN npm install

COPY . .

EXPOSE 5000

EXPOSE 3000

CMD ["node","index.js"]


# FROM node:15.8.0


# WORKDIR /app

# COPY package.json package-lock.json ./


# RUN npm install

# COPY . .

# EXPOSE 5000

# EXPOSE 3000

# CMD ["node","index.js"]