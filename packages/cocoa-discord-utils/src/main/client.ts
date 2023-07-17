import { Client } from "discord.js";

import chalk from "chalk";

import { store } from "../base";

/**
 * Do all the checks before login
 *
 * You are **encouraged** to use this in place of `Client.login()`
 * unless you are having more than one client.
 * (This function does not support that right now)
 *
 * You don't need to call `ManagementCenter.validateCommands()`
 * if you will login the client with this function
 */
export async function checkLogin(client: Client, token: string | undefined) {
  if (!token) {
    throw "Check Fail! Bot token is undefined!";
  }

  await store.notifyAwait("login");

  console.log(chalk.green("Checks done! Logging in..."));

  await client.login(token);
}
