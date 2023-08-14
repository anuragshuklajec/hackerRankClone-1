export const generatecode = (returnType, parameters, code) => { 
    let updatedcode = code;

    const formattedParameters = `test(${parameters.map(e => `${e.type} ${e.name}`).join(", ")})`;

    const functionDeclaration = `${returnType} ${formattedParameters}`;

const inputOutputCode = `
int main()
{
    ${parameters.map(e => `string ${e.name}_temp;\n    getline(cin, ${e.name}_temp);`).join("\n\n    ")}

    try {
        ${parameters.map(e => `${e.type} ${e.name} = stoi(${e.name}_temp);`).join("\n        ")}\n    
        ${returnType === "void" ? "" : `${returnType} result = `}test(${parameters.map(e => e.name).join(", ")});\n        ${returnType === "void" ? "" : "std::cout << result << \"\\n\";    "}
    } catch (const invalid_argument& e) {
        cerr << "Invalid input: " << e.what() << endl;
        return 1;
    }

    return 0;
}
`;

    // Use regular expression to find and replace the function declaration
    const regex = /.*\btest\s*\([^)]*\)/
    updatedcode = updatedcode.replace(regex, functionDeclaration);
    return updatedcode + inputOutputCode;
};
