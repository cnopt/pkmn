using PKHeX.Core;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();

app.UseCors(policy =>
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyMethod()
          .AllowAnyHeader());

app.MapGet("/", () => "backend-api: POST /api/parse-save with a 'save' file field");

app.MapPost("/api/parse-save", async (HttpRequest req) =>
{
    IFormFile? file;
    try
    {
        var form = await req.ReadFormAsync();
        file = form.Files.GetFile("save");
    }
    catch
    {
        return Results.BadRequest(new { error = "Failed to read form data." });
    }

    if (file is null)
        return Results.BadRequest(new { error = "No file provided. Send the save file as a form field named 'save'." });

    using var ms = new MemoryStream();
    await file.CopyToAsync(ms);
    var data = ms.ToArray();

    if (!SaveUtil.TryGetSaveFile(data, out var sav, file.FileName))
        return Results.UnprocessableEntity(new { error = "Unrecognized or unsupported save file format." });

    return Results.Json(SaveDataDto.From(sav));
});

app.Run("http://localhost:5000");
