import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { openConnection, closeConnection } from "../../../services/postgresDB";
import { app } from "../../../app";

describe("Users API", () => {
  beforeAll(async () => {
    await openConnection();
  }, 15000);

  afterAll(async () => {
    await closeConnection();
  }, 15000);

  describe("Test GET: v1/users/all", () => {
    test("should respond 200 success", async () => {
      await request(app)
        .get("/v1/users/all")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
