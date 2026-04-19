exports.handler = async function (event) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: [{ text: "Emergency, which service do you require?" }] }),
  };
};
