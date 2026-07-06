$modules = @(
    "tenants",
    "roles",
    "permissions",
    "students",
    "shifts",
    "seats",
    "student-slots",
    "plans",
    "subscriptions",
    "payments",
    "expenses",
    "attendance",
    "complaints",
    "audit-logs"
)

foreach ($mod in $modules) {
    Write-Host "Generating module, service, controller for $mod..."
    npx @nestjs/cli generate module $mod
    npx @nestjs/cli generate service $mod
    npx @nestjs/cli generate controller $mod
}
Write-Host "Done!"
