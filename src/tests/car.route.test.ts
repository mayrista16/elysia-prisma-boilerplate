import { describe, expect, it, afterAll } from "bun:test";
import { app } from '../index';
import { randomUUID } from 'crypto';
import { createTestClient } from "./utils/createTestClient";
import { HttpStatusEnum } from "../utils/httpStatusCode";

interface TestContext {
    refreshToken: string;
    userToken: string;
    adminToken: string;
    testUserId: string;
}

export const carTest = async(context: TestContext) => {
    return describe('CarRoute Integration Tests with Authentication', () => {
        // Create client with authentication header
        const testClient = createTestClient(app, {
            Authorization: `Bearer ${context.userToken}`
        });

        const testId = randomUUID().substring(0, 3);
        let testCarId: string;

        const carBodyCreate = {
            name: 'Mitsubishi Lancer Evo X', 
            brand: 'Mitsubishi', 
            release_year: 2009, 
            plate_number: `N1${testId}16A`, 
            status: 'Active'
        };

        const carBodyUpdate = {
            name: 'Nissan Skyline GTR', 
            brand: 'Nissan',
            release_year: 2005, 
            plate_number: 'S33X', 
            status: 'Active' 
        };
    
        it('POST /car/create - should create a new car', async () => {
            const response = await testClient.post('/v1/car/create', carBodyCreate);
            expect(response.status).toBe(HttpStatusEnum.HTTP_200_OK);

            const body = await response.json<{
                data: { id: string }
            }>();
            testCarId = body.data.id;
           
            expect(testCarId).toBeDefined();
            console.log("Car ID : ", body.data.id);
        });
    
        it('GET /car/ - should return all cars', async () => {
            const response = await testClient.get('/v1/car');
            expect(response.status).toBe(HttpStatusEnum.HTTP_200_OK);
        });
    
        it('GET /car/:id - should return a car by ID', async () => {
            const response = await testClient.get(`/v1/car/getcar/${testCarId}`);
            expect(response.status).toBe(HttpStatusEnum.HTTP_200_OK);
            
            console.log("Car ID : ", testCarId);
        });
    
        it('PATCH /car/:id - should update a car', async () => {
            const response = await testClient.patch(
                `/v1/car/${testCarId}`, 
                carBodyUpdate
            );
            expect(response.status).toBe(HttpStatusEnum.HTTP_200_OK);
        });
    
        it('DELETE /car/:id - should delete a car', async () => {
            const response = await testClient.delete(`/v1/car/${testCarId}`);
            expect(response.status).toBe(HttpStatusEnum.HTTP_200_OK);
    
            // Verify deletion
            const deletedResponse = await testClient.get(`/v1/car/${testCarId}`);
            expect(deletedResponse.status).toBe(HttpStatusEnum.HTTP_404_NOT_FOUND);
        });

        afterAll(async () => {
        });

    });
};