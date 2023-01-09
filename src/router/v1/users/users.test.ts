import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import request from "supertest";
import { openConnection, closeConnection } from "../../../models/postgresDB";
import { app } from "../../../app";

describe("Users API", () => {
  //before all test
  beforeAll(async () => {
    await openConnection();
  }, 15000);

  //after all test
  afterAll(async () => {
    await closeConnection();
  }, 15000);

  type ServerOutputSchema = {
    message: string;
    statusCode: number;
    data: unknown | null | undefined;
  };

  const zodUserDataSchema = z.object({
    userid: z.number().positive(),
    email: z.string().email(),
    name: z.string(),
    image: z.string().url().nullable(),
    accessToken: z.string(),
    refreshToken: z.string(),
  });

  type UserDataSchema = z.infer<typeof zodUserDataSchema>;

  let userData: UserDataSchema;

  describe("Test GET: v1/users/oneuser", () => {
    const registerData = {
      email: "TEEEEEEEEST@mail.dummy.only.com",
      password: "HELLO_there_123",
      name: "Test Jest",
    };

    test("[setup user data] should respond 201 created", async () => {
      await request(app)
        .post("/v1/auth/register")
        .send(registerData)
        .expect("Content-Type", /json/)
        .expect(201);
      // .expect((result: any) => result satisfies ServerOutputSchema)
      // .expect((result: any) => result.data satisfies UserDataSchema)
      // .then((result: any) => {
      //   console.log("JEST: ", result.data);
      //   return result.data as UserDataSchema;
      // })
    }, 10000);

    // test("should respond 200 success", async () => {
    //   await request(app)
    //     .get("/v1/users/ondeuser")
    //     .expect("Content-Type", /json/)
    //     .expect(200);
    // });
  });
});
