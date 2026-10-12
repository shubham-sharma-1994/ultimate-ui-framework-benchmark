#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QFontDatabase>
#include <QQmlContext>
#include <QObject>

#ifdef Q_OS_WASM
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

class HistoryManager : public QObject {
    Q_OBJECT
public:
    explicit HistoryManager(QObject *parent = nullptr) : QObject(parent) {
#ifdef Q_OS_WASM
        instance = this;
        // Set up the popstate callback
        EM_ASM(
            window.addEventListener('popstate', function(event) {
                // Call back into C++ to trigger the pop
                if (typeof Module !== 'undefined' && Module.ccall) {
                    Module.ccall('onPopStateCallback', 'v');
                } else if (typeof _onPopStateCallback !== 'undefined') {
                    _onPopStateCallback();
                } else {
                     // try modern emscripten
                     // This is tricky, let's use a simpler way, export a C function
                }
            });
        );
#endif
    }

    Q_INVOKABLE void pushState() {
#ifdef Q_OS_WASM
        EM_ASM(
            window.history.pushState({ page: "page2" }, "", "");
        );
#endif
    }

signals:
    void popRequested();

#ifdef Q_OS_WASM
public:
    static HistoryManager* instance;
    static void handlePopState() {
        if (instance) {
            emit instance->popRequested();
        }
    }
#endif
};

#ifdef Q_OS_WASM
HistoryManager* HistoryManager::instance = nullptr;
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void onPopStateCallback() {
        HistoryManager::handlePopState();
    }
}
#endif

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

    HistoryManager historyManager;
    engine.rootContext()->setContextProperty("historyManager", &historyManager);

    const QUrl url(u"qrc:/PulseAppExe/qml/Main.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreationFailed,
        &app, []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
#include "main.moc"
