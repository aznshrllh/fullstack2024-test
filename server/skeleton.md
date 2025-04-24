npm init -y
npm i -D sequelize-cli
npm i pg express sequelize cors axios
npx sequelize-cli init

# Generate Category model

npx sequelize-cli model:generate --name Category --attributes name:string

# Generate Status model

npx sequelize-cli model:generate --name Status --attributes name:string

# Generate Product model

npx sequelize-cli model:generate --name Product --attributes id_produk:string,nama_produk:string,harga:decimal,kategori_id:integer,status_id:integer

npx sequelize-cli seed:generate --name seeding-on-Categories

npx sequelize-cli seed:generate --name seeding-on-Statuses

npx sequelize-cli seed:generate --name seeding-on-Products
