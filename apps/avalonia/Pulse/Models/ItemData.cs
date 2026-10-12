using System.Collections.Generic;
using Newtonsoft.Json;

namespace Pulse.Models
{
    public class DataRoot
    {
        [JsonProperty("items")]
        public List<ItemData> Items { get; set; } = new List<ItemData>();
    }

    public class ItemData
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; } = string.Empty;

        [JsonProperty("subtitle")]
        public string Subtitle { get; set; } = string.Empty;

        [JsonProperty("score")]
        public int Score { get; set; }

        [JsonProperty("colors")]
        public List<string> Colors { get; set; } = new List<string>();

        [JsonProperty("body")]
        public string Body { get; set; } = string.Empty;
    }
}
