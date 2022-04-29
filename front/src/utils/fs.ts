export const selectFile = () => {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.style.display = "hidden";
    input.type = "file";
    input.onchange = () => {
      resolve(input.files?.[0] || null);
    };
    input.click();
  });
};

export const parseCsvFile = async (file: File) => {
  return new Promise<Array<Array<string>>>((resolve) => {
    const chunk = file.slice(0, 1024);

    const csv: Array<Array<string>> = [];

    let str = "";
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      str = (e?.target?.result as string) || "";
      const lines = str.split("\n");

      const header = lines[0].split(",").map((x) => x.trim());
      csv.push(header);

      for (let i = 1; i < lines.length; i++) {
        if (!lines[0].length) break;
        let line = lines[i].split(",").map((x) => x.trim());
        csv.push(line);
      }
      resolve(csv);
    });
    reader.readAsBinaryString(chunk);
  });
};
