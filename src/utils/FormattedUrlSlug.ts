const formattedUrlSlug = (str: string) => {
  const normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  return normalized.replace(/\s+/g, "-").toLowerCase();
};

export default formattedUrlSlug;
