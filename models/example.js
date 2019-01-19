module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Example", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ingredientName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Banana"
    }
  });
  return Example;
};

  // module.exports = function(sequelize, DataTypes) {
  //   var Example = sequelize.define("Example", {
  //     text: DataTypes.STRING,
  //     description: DataTypes.TEXT
  //   });
  //   return Example;
  // };