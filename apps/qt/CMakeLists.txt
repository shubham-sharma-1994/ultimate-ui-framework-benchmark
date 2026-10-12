cmake_minimum_required(VERSION 3.16)

project(PulseAppExe VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 6.4 REQUIRED COMPONENTS Quick Gui Qml Network)

qt_standard_project_setup(REQUIRES 6.4)

# Add Inter font to the project
file(DOWNLOAD https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf ${CMAKE_CURRENT_SOURCE_DIR}/assets/Inter-Regular.ttf)
file(DOWNLOAD https://github.com/google/fonts/raw/main/ofl/inter/Inter-Medium.ttf ${CMAKE_CURRENT_SOURCE_DIR}/assets/Inter-Medium.ttf)
file(DOWNLOAD https://github.com/google/fonts/raw/main/ofl/inter/Inter-SemiBold.ttf ${CMAKE_CURRENT_SOURCE_DIR}/assets/Inter-SemiBold.ttf)
file(DOWNLOAD https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf ${CMAKE_CURRENT_SOURCE_DIR}/assets/Inter-Bold.ttf)

qt_add_executable(PulseAppExe
    src/main.cpp
)

qt_add_qml_module(PulseAppExe
    URI PulseAppExe
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/Theme.qml
        qml/Page1.qml
        qml/Page2.qml
        qml/components/CustomButton.qml
        qml/components/OrbitPainter.qml
        qml/components/ProgressRing.qml
    RESOURCES
        assets/data.json
        assets/logo.svg
        assets/Inter-Regular.ttf
        assets/Inter-Medium.ttf
        assets/Inter-SemiBold.ttf
        assets/Inter-Bold.ttf
)

set_target_properties(PulseAppExe PROPERTIES
    OUTPUT_NAME PulseApp
    MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_link_libraries(PulseAppExe
    PRIVATE Qt6::Quick Qt6::Gui Qt6::Qml Qt6::Network
)

include(GNUInstallDirs)
install(TARGETS PulseAppExe
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
