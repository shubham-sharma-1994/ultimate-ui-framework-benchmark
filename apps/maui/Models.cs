namespace Pulse;

public class ItemData
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public int Score { get; set; }
    public string[] Colors { get; set; } = Array.Empty<string>();
    public string Body { get; set; } = "";
}

public class RootData
{
    public ItemData[] Items { get; set; } = Array.Empty<ItemData>();
}
