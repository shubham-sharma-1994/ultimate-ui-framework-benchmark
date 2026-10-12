import re

# We need to implement:
# C17 keyboard + hover states (PointerGestureRecognizer, key handlers on Windows)
# C04 hero flight with an animated clone overlay
# C07 real spring

with open("apps/maui/MainPage.xaml", "r") as f:
    main_xaml = f.read()

# For hover, we can add PointerGestureRecognizer to things like Button, Border
# <PointerGestureRecognizer PointerEntered="OnPointerEntered" PointerExited="OnPointerExited" />

pointer_handlers = """
    private void OnPointerEntered(object sender, PointerEventArgs e)
    {
        if (sender is View view)
        {
            view.FadeTo(0.8, 150);
            view.ScaleTo(1.02, 150);
        }
    }

    private void OnPointerExited(object sender, PointerEventArgs e)
    {
        if (sender is View view)
        {
            view.FadeTo(1, 150);
            view.ScaleTo(1, 150);
        }
    }
"""

with open("apps/maui/MainPage.xaml.cs", "r") as f:
    main_cs = f.read()

if "OnPointerEntered" not in main_cs:
    main_cs = main_cs.replace("public partial class MainPage : ContentPage\n{", "public partial class MainPage : ContentPage\n{" + pointer_handlers)

with open("apps/maui/MainPage.xaml.cs", "w") as f:
    f.write(main_cs)

with open("apps/maui/DetailPage.xaml.cs", "r") as f:
    detail_cs = f.read()

if "OnPointerEntered" not in detail_cs:
    detail_cs = detail_cs.replace("public partial class DetailPage : ContentPage\n{", "public partial class DetailPage : ContentPage\n{" + pointer_handlers)

with open("apps/maui/DetailPage.xaml.cs", "w") as f:
    f.write(detail_cs)
