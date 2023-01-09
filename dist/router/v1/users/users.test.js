"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const zod_1 = require("zod");
const supertest_1 = __importDefault(require("supertest"));
const postgresDB_1 = require("../../../models/postgresDB");
const app_1 = require("../../../app");
(0, globals_1.describe)("Users API", () => {
    //before all test
    (0, globals_1.beforeAll)(async () => {
        await (0, postgresDB_1.openConnection)();
    }, 15000);
    //after all test
    (0, globals_1.afterAll)(async () => {
        await (0, postgresDB_1.closeConnection)();
    }, 15000);
    const zodUserDataSchema = zod_1.z.object({
        userid: zod_1.z.number().positive(),
        email: zod_1.z.string().email(),
        name: zod_1.z.string(),
        image: zod_1.z.string().url().nullable(),
        accessToken: zod_1.z.string(),
        refreshToken: zod_1.z.string(),
    });
    let userData;
    (0, globals_1.describe)("Test GET: v1/users/oneuser", () => {
        const registerData = {
            email: "TEEEEEEEEST@mail.dummy.only.com",
            password: "HELLO_there_123",
            name: "Test Jest",
        };
        (0, globals_1.test)("[setup user data] should respond 201 created", async () => {
            await (0, supertest_1.default)(app_1.app)
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
