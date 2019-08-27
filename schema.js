const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");
const fetch = require("node-fetch");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
});

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        async function getLaunches() {
          let response = await fetch("https://api.spacexdata.com/v3/launches/");
          return await response.json();
        }
        return getLaunches();
      }
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        async function getLaunch() {
          let response = await fetch(
            `https://api.spacexdata.com/v3/launches/${args.flight_number}`
          );
          return await response.json();
        }
        return getLaunch();
      }
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        async function getLaunches() {
          let response = await fetch("https://api.spacexdata.com/v3/rockets");
          return await response.json();
        }
        return getLaunches();
      }
    },
    rocket: {
      type: LaunchType,
      args: {
        rocket_id: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        async function getLaunch() {
          let response = await fetch(
            `https://api.spacexdata.com/v3/rockets/${args.rocket_id}`
          );
          return await response.json();
        }
        return getLaunch();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
