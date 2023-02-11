FROM node:16.19

# set working directory
WORKDIR /app

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH
# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm config set unsafe-perm true
RUN npm install --legacy-peer-deps

# add app
COPY . ./

RUN chown -R node /app/node_modules

# start app
CMD ["npm", "start"]
