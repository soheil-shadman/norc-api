let functions = [];
for (var i = 0; i < 8; i++) {
    const ii = i;
    functions.push(() => {
        console.log(ii);
    });
}
functions[2]();