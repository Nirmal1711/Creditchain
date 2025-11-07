// SPDX-License-Identifier: MIT
const Dashboard = artifacts.require("dashboard");

module.exports = function (deployer) {
  deployer.deploy(Dashboard);
};