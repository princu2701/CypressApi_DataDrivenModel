describe('SampleBooksDriven', () => {
    const baseurl = "https://simple-books-api.glitch.me";
    let token;
    let order;
    let data;
   // let randomEmail=Math.random().toString(5).substring(2)

    before('datadriven', () => {
        cy.fixture('samplebook.csv').then((response) => {
            data = response;
        });
    });

    it('GetStatus', () => {
        cy.request({
            method: "GET",
            url: baseurl + "/status",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('ListofBooks', () => {
        cy.request({
            method: "GET",
            url: baseurl + "/books",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('GetaSingleBook', () => {
        cy.request({
            method: "GET",
            url: baseurl + "/books/2",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log(JSON.stringify(response.body));
        });
    });

    it('AuthenticateanOrder', () => {
        cy.wrap(data).each((first) => {
            cy.request({
                method: "POST",
                url: baseurl + "/api-clients/",
                body: {
                    "clientName": first.clientName,
                    "clientEmail": first.clientEmail
                },
                headers: {
                    "Content-Type": "application/json"
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(201);
                const res = JSON.parse(JSON.stringify(response.body));
                token = res.accessToken;
                cy.log(token);
            });
        });
    });

    it('SubmitanOrder', () => {
        cy.request({
            method: "POST",
            url: baseurl + "/orders",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: {
                "bookId": 1,
                "customerName": "John"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
            cy.log(JSON.stringify(response.body));
        });
    });

    it('Getallorder', () => {
        cy.request({
            method: "GET",
            url: baseurl + "/orders",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);

            const res = JSON.parse(JSON.stringify(response.body));
            order = res[0].id;
            cy.log(order);
        });
    });

    it('Getanorder', () => {
        cy.request({
            method: "GET",
            url: baseurl + "/orders/" + order,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('UpdateanOrder', () => {
        cy.request({
            method: "PATCH",
            url: baseurl + "/orders/" + order,
            body: {
                "customerName": "Hirak"
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    });

    it('DeleteanOrder', () => {
        cy.request({
            method: "DELETE",
            url: baseurl + "/orders/" + order,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    });
});
