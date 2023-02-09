FROM node:16.19

# set working directory
WORKDIR /app

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

# add app
COPY . ./

# start app
CMD ["npm", "start"]
