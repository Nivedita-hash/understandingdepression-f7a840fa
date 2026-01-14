import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import ScrollIndicator from '@/components/ScrollIndicator';
import { TrendingDown, Heart, RefreshCw, Sun } from 'lucide-react';

const AboutDepression = () => {
  const sections = [
    {
      icon: TrendingDown,
      title: "It's Not Just Sadness",
      content: "Depression is more than feeling sad. It's a complex condition that affects how you think, feel, and handle daily activities. It can manifest as persistent emptiness, loss of interest in things you once enjoyed, or a sense of hopelessness that colors everything.",
      color: "text-clay"
    },
    {
      icon: RefreshCw,
      title: "A Non-Linear Journey",
      content: "Recovery from depression rarely follows a straight path. There are setbacks and breakthroughs, plateaus and progress. Understanding this non-linearity is crucial—both for those experiencing depression and those supporting them.",
      color: "text-medical"
    },
    {
      icon: Heart,
      title: "Treatment Takes Many Forms",
      content: "From therapy and medication to lifestyle changes and support groups, treatment approaches are as varied as the individuals seeking help. What works for one person may not work for another—and that's okay.",
      color: "text-primary"
    },
    {
      icon: Sun,
      title: "Recovery Is Possible",
      content: "While depression can feel permanent, recovery is possible. For many, it means learning to manage symptoms effectively. For others, it means complete remission. Each journey is valid and valuable.",
      color: "text-sage"
    }
  ];

  return (
    <PageWrapper 
      backPath="/"
      backLabel="Home"
      nextPath="/cases"
      nextLabel="Case Stories"
    >
      <div className="page-container max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="heading-display mb-6">Understanding Depression</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Before we explore individual journeys, let's understand what depression 
            looks like as a process that unfolds over time.
          </p>
        </motion.header>

        {/* Journey Infographic */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-card mb-16"
        >
          <h2 className="heading-section text-center mb-8">Depression as a Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-clay-light flex items-center justify-center">
                <span className="text-2xl font-serif text-clay">1</span>
              </div>
              <h3 className="font-medium mb-2">Onset</h3>
              <p className="text-sm text-muted-foreground">Triggers and early symptoms emerge</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-medical-light flex items-center justify-center">
                <span className="text-2xl font-serif text-medical">2</span>
              </div>
              <h3 className="font-medium mb-2">Recognition</h3>
              <p className="text-sm text-muted-foreground">Acknowledging the need for help</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-light flex items-center justify-center">
                <span className="text-2xl font-serif text-sage">3</span>
              </div>
              <h3 className="font-medium mb-2">Treatment</h3>
              <p className="text-sm text-muted-foreground">Finding what works for you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-serif text-primary">4</span>
              </div>
              <h3 className="font-medium mb-2">Living With</h3>
              <p className="text-sm text-muted-foreground">Recovery, management, or thriving</p>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="section-card flex gap-6"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${section.color}`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="heading-section mb-3">{section.title}</h3>
                <p className="narrative-text text-muted-foreground">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 py-8 border-t border-border"
        >
          <p className="text-muted-foreground italic">
            "Every person's experience with depression is unique. 
            The following stories illustrate the diversity of these journeys."
          </p>
        </motion.div>
      </div>
      <ScrollIndicator />
    </PageWrapper>
  );
};

export default AboutDepression;
