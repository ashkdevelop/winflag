FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Winflag.API.csproj", "."]
COPY ["../Winflag.Application/Winflag.Application.csproj", "../Winflag.Application/"]
COPY ["../Winflag.Infrastructure/Winflag.Infrastructure.csproj", "../Winflag.Infrastructure/"]
COPY ["../Winflag.Core/Winflag.Core.csproj", "../Winflag.Core/"]
RUN dotnet restore
COPY . .
COPY ../Winflag.Application ../Winflag.Application
COPY ../Winflag.Infrastructure ../Winflag.Infrastructure
COPY ../Winflag.Core ../Winflag.Core
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Winflag.API.dll"]
