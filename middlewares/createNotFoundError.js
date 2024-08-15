function createNotFoundError() {
  const err = new Error("Not Found");
  err.status = 404;
  return err;
}

export default createNotFoundError;
