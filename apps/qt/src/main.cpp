#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QFontDatabase>

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    // Load Fonts
    QFontDatabase::addApplicationFont(":/PulseAppExe/assets/Inter-Regular.ttf");
    QFontDatabase::addApplicationFont(":/PulseAppExe/assets/Inter-Medium.ttf");
    QFontDatabase::addApplicationFont(":/PulseAppExe/assets/Inter-SemiBold.ttf");
    QFontDatabase::addApplicationFont(":/PulseAppExe/assets/Inter-Bold.ttf");

    QFont defaultFont("Inter");
    defaultFont.setStyleHint(QFont::SansSerif);
    QGuiApplication::setFont(defaultFont);

    QQmlApplicationEngine engine;
    const QUrl url(u"qrc:/PulseAppExe/qml/Main.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreationFailed,
        &app, []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
