export let ConfigData = {
    Port: 4000,
    RootPath: __dirname + '/',
    ProjectBasePath: 'http://localhost:4000',
    RequestMode: 'DEV', // DEBUG/PROD .....//DEBUG should be sent as a data

    PrettyErrorMessage: "OOPS Server Error. Please try Later.",
    errorSeparationChar: "<br>",
    LogError: {
        wetherMail: true,
        wetherDb: true,
        wetherFile: true

    },
    FilePaths: {
        logFilePath: '/log/errors'
    }
}
