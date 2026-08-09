FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/src/Winflag.API/Winflag.API.csproj Winflag.API/
COPY backend/src/Winflag.Application/Winflag.Application.csproj Winflag.Application/
COPY backend/src/Winflag.Infrastructure/Winflag.Infrastructure.csproj Winflag.Infrastructure/
COPY backend/src/Winflag.Core/Winflag.Core.csproj Winflag.Core/
RUN dotnet restore Winflag.API/Winflag.API.csproj
COPY backend/src/Winflag.API/ Winflag.API/
COPY backend/src/Winflag.Application/ Winflag.Application/
COPY backend/src/Winflag.Infrastructure/ Winflag.Infrastructure/
COPY backend/src/Winflag.Core/ Winflag.Core/
WORKDIR /src/Winflag.API
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Winflag.API.dll"]
