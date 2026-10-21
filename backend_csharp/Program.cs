using WanderMatch.PragmaticFintech.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<GroupSplitBillVietQrService>();
builder.Services.AddSingleton<InstantRefundPreviewService>();
builder.Services.AddSingleton<InventoryQualityGateValidator>();
builder.Services.AddSingleton<PartnerLinkedBankSettlementService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Ok(new
{
    Service = "WanderMatch 3.1 Pragmatic Fintech & B2B SLA Engine",
    Status = "ONLINE",
    Pillars = new[]
    {
        "1. Retail Value Floor 120% & SLA Guarantee",
        "2. Minimum Quality Baseline & Comfort Locks",
        "3. Blind Logistics Kit (Departure Window, Packing, OOO Generator)",
        "4. Pocket Concierge & Transparent Value Receipt & SOS SLA",
        "5. Group Split-Bill VietQR & Instant Payout Refund"
    }
}));

// API: Group Split Bill VietQR
app.MapPost("/api/fintech/group-session", async (CreateGroupSessionDto dto, GroupSplitBillVietQrService service) =>
{
    var session = await service.CreateGroupSessionAsync(dto);
    return Results.Ok(session);
});

app.MapPost("/api/fintech/group-session/{groupCode}/pay/{memberIndex}", async (string groupCode, int memberIndex, decimal amount, GroupSplitBillVietQrService service) =>
{
    var updated = await service.ProcessMemberPaymentWebhookAsync(groupCode, memberIndex, amount);
    return Results.Ok(updated);
});

app.MapPost("/api/fintech/group-session/{groupCode}/cancel-refund", async (string groupCode, GroupSplitBillVietQrService service) =>
{
    var refunded = await service.TriggerAutomaticFullRefundSagaAsync(groupCode);
    return Results.Ok(refunded);
});

// API: Instant Refund Preview
app.MapGet("/api/fintech/refund-simulation/{tripId}", async (Guid tripId, decimal price, DateTime departureTime, InstantRefundPreviewService service) =>
{
    var sim = await service.GetRefundSimulationAsync(tripId, price, departureTime);
    return Results.Ok(sim);
});

app.MapPost("/api/fintech/refund-execute", async (ExecuteInstantRefundRequest req, decimal netRefund, InstantRefundPreviewService service) =>
{
    var result = await service.ExecuteInstantPayoutRefundAsync(req, netRefund);
    return Results.Ok(result);
});

// API: B2B Inventory Quality Gate
app.MapPost("/api/b2b/quality-gate/validate", async (B2BInventorySubmissionDto dto, InventoryQualityGateValidator validator) =>
{
    var res = await validator.ValidateInventorySubmissionAsync(dto);
    return Results.Ok(res);
});

// API: B2B Partner Linked Bank Settlement
app.MapPost("/api/b2b/settlement/stage1-checkin", async (Guid commitmentId, Guid partnerId, string partnerName, string kybAccount, decimal totalNetPrice, PartnerLinkedBankSettlementService service) =>
{
    var res = await service.ExecuteStage1CheckInSettlementAsync(commitmentId, partnerId, partnerName, kybAccount, totalNetPrice);
    return Results.Ok(res);
});

app.MapPost("/api/b2b/settlement/stage2-checkout", async (Guid commitmentId, Guid partnerId, decimal totalNetPrice, bool hasSlaClaim, decimal slaPenalty, PartnerLinkedBankSettlementService service) =>
{
    var res = await service.ExecuteStage2CheckOutSettlementAsync(commitmentId, partnerId, totalNetPrice, hasSlaClaim, slaPenalty);
    return Results.Ok(res);
});

app.Run();
