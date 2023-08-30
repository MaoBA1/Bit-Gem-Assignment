function Input({ onChange, display, id, type }) {
  return (
    <input
      style={{ display: display }}
      id={id}
      type={type}
      onChange={onChange}
    />
  );
}

export default Input;
