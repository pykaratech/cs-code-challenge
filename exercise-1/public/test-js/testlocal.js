describe("Test case myself", function() {
const imgurl="https://s3.amazonaws.com/uifaces/faces/twitter/daykiine/128.jpg";
const datetime="2021-03-31T13:24:14.020Z";
const datetime1="31-03-2021 18:54:1";

  it("imgError test", function() {
    assert.equal(imgError(imgurl), true);
  });

  it("formatDateTime test", function() {
    assert.equal(formatDateTime(datetime), datetime1);
  });


});
