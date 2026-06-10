using PKHeX.Core;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddHttpClient();
var app = builder.Build();

app.UseCors(policy =>
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyMethod()
          .AllowAnyHeader());

app.MapGet("/", () => "backend-api: POST /api/parse-save with a 'save' file field, or POST /api/fetch-url with { \"url\": \"...\" }");

app.MapPost("/api/fetch-url", async (FetchUrlRequest body, IHttpClientFactory httpClientFactory) =>
{
    if (string.IsNullOrWhiteSpace(body?.Url))
        return Results.BadRequest(new { error = "URL is required." });

    if (!Uri.TryCreate(body.Url.Trim(), UriKind.Absolute, out var uri)
        || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        return Results.BadRequest(new { error = "URL must be an absolute http or https URL." });

    var client = httpClientFactory.CreateClient();
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.UserAgent.ParseAdd("PKSave-Reader/1.0");

    HttpResponseMessage response;
    try
    {
        response = await client.GetAsync(uri);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = $"Failed to fetch URL: {ex.Message}" });
    }

    using (response)
    {
        if (!response.IsSuccessStatusCode)
            return Results.BadRequest(new { error = $"Remote server returned {(int)response.StatusCode}." });

        var bytes = await response.Content.ReadAsByteArrayAsync();
        if (bytes.Length == 0)
            return Results.BadRequest(new { error = "URL returned an empty file." });

        var filename = GetFilenameFromResponse(uri, response);
        return Results.File(bytes, "application/octet-stream", filename);
    }
});

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

static string GetFilenameFromResponse(Uri uri, HttpResponseMessage response)
{
    if (response.Content.Headers.ContentDisposition?.FileName is { } name)
        return name.Trim('"');

    var pathName = Path.GetFileName(uri.LocalPath);
    return string.IsNullOrEmpty(pathName) ? "save.sav" : pathName;
}

record FetchUrlRequest(string Url);
