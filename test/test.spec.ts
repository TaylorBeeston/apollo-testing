import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import request from "supertest";

import { myResolver } from "../src/graphql/resolvers";
import { server } from "../src/server";
import { mockContext } from "./testUtils"; // Assuming you have test helpers

import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import { print } from "graphql";

let url;

describe("Testing Apollo Server", () => {
    beforeAll(async () => {
        const startedServer = await startStandaloneServer(server);
        url = startedServer.url;
    });

    afterAll(() => server.stop());

    describe("Unit Testing a Resolver", () => {
        test("myResolver returns the expected greeting", () => {
            const result = myResolver({}, { name: "Alice" }, mockContext, {});

            expect(result).toEqual({ greeting: "Hello Alice!" });
        });
    });

    describe("Integration Testing", () => {
        test("fetches user data correctly", async () => {
            const GET_USER = gql`
        query getUser($id: String!) {
          user(id: $id) {
            id
            name
          }
        }
      `;

            const res = await server.executeOperation({
                query: GET_USER,
                variables: { id: "1" },
            });

            if (res.body.kind !== "single") throw new Error("Wrong response kind");

            expect(res.body.singleResult.data?.user).toEqual({
                id: "1",
                name: "Bob",
            });
        });
    });

    describe("End-to-End Testing", () => {
        test("creates a new user", async () => {
            const CREATE_USER = gql`
        mutation createUser($name: String!) {
          createUser(name: $name) {
            id
          }
        }
      `;

            const res = await request(url)
                .post("/")
                .send({ query: print(CREATE_USER), variables: { name: "Sarah" } });

            expect(res.status).toBe(200);
            expect(res.body.data.createUser.id).toBeDefined();
        });
    });
});
