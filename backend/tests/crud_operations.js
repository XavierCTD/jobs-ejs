const { app } = require("../app");
const get_chai = require("../utils/get_chai");
const { seed_db, testUserPassword } = require("../utils/seed_db");

describe("notes CRUD operations (SPA)", function () {
  before(async () => {
    const { expect, request } = await get_chai();
    this.test_user = await seed_db();

    let req = request.execute(app).get("/sessions/logon").send();
    let res = await req;
    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];
    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken"),
    );

    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };

    req = request
      .execute(app)
      .post("/sessions/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid"),
    );

    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });

  it("should get notes list (API)", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .get("/api/notes")
      .set("Cookie", this.sessionCookie)
      .send();
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("body");
    expect(res.body).to.have.property("notes");
  });

  it("should create a note (API)", async () => {
    const { expect, request } = await get_chai();
    const dataToPost = {
      title: "Test Note Title",
      body: "This is a test note created by mocha.",
    };
    const req = request
      .execute(app)
      .post("/api/notes")
      .set("Cookie", this.sessionCookie)
      .set("content-type", "application/json")
      .send(dataToPost);
    const res = await req;
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("note");
    expect(res.body.note.title).to.equal("Test Note Title");
  });

  it("should update a note (API)", async () => {
    const { expect, request } = await get_chai();
    const createReq = request
      .execute(app)
      .post("/api/notes")
      .set("Cookie", this.sessionCookie)
      .set("content-type", "application/json")
      .send({ title: "Temp", body: "Temp body" });
    const createRes = await createReq;
    const noteId = createRes.body.note._id;

    const updateReq = request
      .execute(app)
      .patch(`/api/notes/${noteId}`)
      .set("Cookie", this.sessionCookie)
      .set("content-type", "application/json")
      .send({ title: "Updated", body: "Updated body" });
    const updateRes = await updateReq;
    expect(updateRes).to.have.status(200);
    expect(updateRes.body.note.title).to.equal("Updated");
  });

  it("should delete a note (API)", async () => {
    const { expect, request } = await get_chai();
    const createReq = request
      .execute(app)
      .post("/api/notes")
      .set("Cookie", this.sessionCookie)
      .set("content-type", "application/json")
      .send({ title: "Delete Me", body: "Delete body" });
    const createRes = await createReq;
    const noteId = createRes.body.note._id;

    const deleteReq = request
      .execute(app)
      .delete(`/api/notes/${noteId}`)
      .set("Cookie", this.sessionCookie)
      .send();
    const deleteRes = await deleteReq;
    expect(deleteRes).to.have.status(200);
  });

  it("should load notes page (SPA)", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .get("/notes")
      .set("Cookie", this.sessionCookie)
      .send();
    const res = await req;
    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Notes");
  });
});
